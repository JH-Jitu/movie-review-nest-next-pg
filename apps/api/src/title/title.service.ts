// src/title/title.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto, SortOrder } from '../common/dto/pagination.dto';
import { QueryFilters } from '../common/filters/query-filter';
import { TitleType } from '@prisma/client';
import {
  CreateEpisodeDto,
  CreateTitleDto,
  UpdateEpisodeDto,
  UpdateTitleDto,
} from './title.dto';
import slugify from 'slugify';

@Injectable()
export class TitleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'releaseDate',
      sortOrder = SortOrder.DESC,
    } = query;
    const skip = (page - 1) * limit;

    const filters = QueryFilters.createTitleFilters(query);

    const [data, total] = await Promise.all([
      this.prisma.title.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        include: {
          genres: true,
          certification: true,
          production: true,
          _count: {
            select: {
              ratings: true,
              reviews: true,
            },
          },
        },
      }),
      this.prisma.title.count({ where: filters }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const title = await this.prisma.title.findUnique({
      where: { id },
      include: {
        genres: true,
        certification: true,
        production: true,
        cast: {
          include: {
            person: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        crew: {
          include: {
            person: true,
          },
        },
        _count: {
          select: {
            ratings: true,
            reviews: true,
          },
        },
      },
    });

    if (!title) {
      throw new NotFoundException(`Title with ID ${id} not found`);
    }

    return title;
  }

  async create(createTitleDto: CreateTitleDto) {
    const { genreIds, certificationIds, ...titleData } = createTitleDto;

    // Generate slug from primaryTitle and add year if releaseDate exists
    let slug = slugify(titleData.primaryTitle, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    if (titleData.releaseDate) {
      const year = new Date(titleData.releaseDate).getFullYear();
      slug = `${slug}-${year}`;
    }

    // Check if slug exists and make it unique if needed
    const existingTitle = await this.prisma.title.findUnique({
      where: { slug },
    });

    if (existingTitle) {
      slug = `${slug}-${Date.now()}`;
    }

    return this.prisma.title.create({
      data: {
        ...titleData,
        slug,
        genres: {
          connect: genreIds.map((id) => ({ id })),
        },
        certification: {
          connect: certificationIds.map((id) => ({ id })),
        },
      },
      include: {
        genres: true,
        certification: true,
      },
    });
  }

  async update(id: string, updateTitleDto: UpdateTitleDto) {
    const { genreIds, certificationIds, ...titleData } = updateTitleDto;

    await this.findOne(id);

    return this.prisma.title.update({
      where: { id },
      data: {
        ...titleData,
        genres: {
          set: genreIds?.map((id) => ({ id })),
        },
        certification: {
          set: certificationIds?.map((id) => ({ id })),
        },
      },
      include: {
        genres: true,
        certification: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.title.delete({ where: { id } });
  }

  async updatePoster(id: string, posterUrl: string) {
    await this.findOne(id);
    return this.prisma.title.update({
      where: { id },
      data: { posterUrl },
    });
  }

  async updateBackdrop(id: string, backdropUrl: string) {
    await this.findOne(id);
    return this.prisma.title.update({
      where: { id },
      data: { backdropUrl },
    });
  }

  // Episodes
  async findEpisodes(seriesId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const series = await this.findOne(seriesId);
    if (series.titleType !== TitleType.TV_SERIES) {
      throw new BadRequestException('Title is not a TV series');
    }

    const [data, total] = await Promise.all([
      this.prisma.episode.findMany({
        where: { seriesId },
        skip,
        take: limit,
        orderBy: [{ seasonNumber: 'asc' }, { episodeNumber: 'asc' }],
      }),
      this.prisma.episode.count({ where: { seriesId } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async addEpisode(seriesId: string, createEpisodeDto: CreateEpisodeDto) {
    const series = await this.findOne(seriesId);
    if (series.titleType !== TitleType.TV_SERIES) {
      throw new BadRequestException('Title is not a TV series');
    }

    return this.prisma.episode.create({
      data: {
        ...createEpisodeDto,
        seriesId,
      },
    });
  }

  async updateEpisode(id: string, updateEpisodeDto: UpdateEpisodeDto) {
    const episode = await this.prisma.episode.findUnique({ where: { id } });
    if (!episode) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }

    return this.prisma.episode.update({
      where: { id },
      data: updateEpisodeDto,
    });
  }

  async removeEpisode(id: string) {
    const episode = await this.prisma.episode.findUnique({ where: { id } });
    if (!episode) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }

    return this.prisma.episode.delete({ where: { id } });
  }

  // Cast & Crew
  async getCast(id: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.castMember.findMany({
        where: { titleId: id },
        skip,
        take: limit,
        include: { person: true },
        orderBy: { order: 'asc' },
      }),
      this.prisma.castMember.count({ where: { titleId: id } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCrew(id: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.crewMember.findMany({
        where: { titleId: id },
        skip,
        take: limit,
        include: { person: true },
      }),
      this.prisma.crewMember.count({ where: { titleId: id } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTrending() {
    return this.prisma.title.findMany({
      where: {
        isReleased: true,
      },
      orderBy: [{ popularity: 'desc' }, { imdbRating: 'desc' }],
      take: 10,
      include: {
        genres: true,
        certification: true,
      },
    });
  }

  async getUpcoming() {
    const now = new Date();
    return this.prisma.title.findMany({
      where: {
        isReleased: false,
        releaseDate: {
          gt: now,
        },
      },
      orderBy: {
        releaseDate: 'asc',
      },
      take: 10,
      include: {
        genres: true,
        certification: true,
      },
    });
  }

  // Review & Ratings
  async getReviews(id: string, query: PaginationQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { titleId: id },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where: { titleId: id } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRatings(id: string, query: PaginationQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = query;
    const skip = (page - 1) * limit;

    const [data, total, stats] = await Promise.all([
      this.prisma.rating.findMany({
        where: { titleId: id },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),
      this.prisma.rating.count({ where: { titleId: id } }),
      this.prisma.rating.aggregate({
        where: { titleId: id },
        _avg: { value: true },
        _count: true,
        _min: { value: true },
        _max: { value: true },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        statistics: {
          averageRating: stats._avg.value || 0,
          totalRatings: stats._count,
          lowestRating: stats._min.value || 0,
          highestRating: stats._max.value || 0,
        },
      },
    };
  }
}