// src/title/title.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto, SortOrder } from '../common/dto/pagination.dto';
import { QueryFilters } from '../common/filters/query-filter';
import { Prisma, TitleType } from '@prisma/client';
import {
  CreateEpisodeDto,
  CreateTitleDto,
  FullSearchDto,
  QuickSearchDto,
  UpdateEpisodeDto,
  UpdateTitleDto,
} from './title.dto';
import slugify from 'slugify';

@Injectable()
export class TitleService {
  constructor(private readonly prisma: PrismaService) {}

  async quickSearch(query: QuickSearchDto) {
    const searchTerms = query.query?.trim().toLowerCase().split(/\s+/) || [];

    if (!searchTerms.length) {
      return [];
    }

    const where: Prisma.TitleWhereInput = {
      AND: [
        {
          OR: [
            {
              primaryTitle: {
                contains: searchTerms[0],
                mode: 'insensitive', // Changed this
              },
            },
            {
              originalTitle: {
                contains: searchTerms[0],
                mode: 'insensitive', // Changed this
              },
            },
          ],
        },
        ...searchTerms.slice(1).map((term) => ({
          OR: [
            {
              primaryTitle: {
                contains: term,
                mode: 'insensitive', // Changed this
              },
            },
            {
              originalTitle: {
                contains: term,
                mode: 'insensitive', // Changed this
              },
            },
          ] as Prisma.TitleWhereInput[],
        })),
      ],
      ...(query.type && { titleType: query.type }),
    };

    return this.prisma.title.findMany({
      where,
      take: query.limit,
      orderBy: [{ popularity: 'desc' }, { primaryTitle: 'asc' }],
      select: {
        id: true,
        primaryTitle: true,
        titleType: true,
        releaseDate: true,
        posterUrl: true,
      },
    });
  }

  // Full search with fixed types
  async searchTitles(query: FullSearchDto) {
    const {
      page = 1,
      limit = 5,
      search,
      sortBy = 'popularity',
      sortOrder = SortOrder.DESC,
      type,
      genre,
      year,
    } = query;

    const skip = (page - 1) * limit;
    const searchTerms = search?.trim().toLowerCase().split(/\s+/) || [];

    // Base where condition for non-search filters
    const baseWhere: Prisma.TitleWhereInput = {
      ...(type && { titleType: type }),
      ...(genre && {
        genres: {
          some: {
            name: { equals: genre, mode: 'insensitive' },
          },
        },
      }),
      ...(year && {
        releaseDate: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${parseInt(year) + 1}-01-01`),
        },
      }),
    };

    // Getting all potential matches with basic filtering
    const allResults = await this.prisma.title.findMany({
      where: baseWhere,
      include: {
        genres: true,
        certification: true,
        _count: {
          select: {
            ratings: true,
            reviews: true,
          },
        },
      },
    });

    // Applying fuzzy search and scoring
    const resultsWithScores = allResults.map((title) => ({
      ...title,
      relevanceScore: this.calculateRelevanceScore(title, searchTerms, search),
    }));

    // Filtering and sorting by relevance score
    const filteredResults = resultsWithScores
      .filter((title) => title.relevanceScore > 400)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Apply pagination
    const paginatedResults = filteredResults.slice(skip, skip + limit);

    return {
      data: paginatedResults,
      meta: {
        total: filteredResults.length,
        page,
        limit,
        totalPages: Math.ceil(filteredResults.length / limit),
      },
    };
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = (str1: string, str2: string): number => {
      str1 = str1.toLowerCase();
      str2 = str2.toLowerCase();
      const costs = [];

      for (let i = 0; i <= str1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= str2.length; j++) {
          if (i === 0) {
            costs[j] = j;
          } else if (j > 0) {
            let newValue = costs[j - 1];
            if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
        if (i > 0) costs[str2.length] = lastValue;
      }
      return costs[str2.length];
    };

    return (longer.length - editDistance(longer, shorter)) / longer.length;
  }

  private calculateRelevanceScore(
    title: any,
    searchTerms: string[],
    fullSearchQuery: string,
  ): number {
    let score = 0;
    const titleLower = title.primaryTitle.toLowerCase();
    const originalTitleLower = title.originalTitle?.toLowerCase() || '';
    const plotLower = title.plot?.toLowerCase() || '';
    const searchLower = fullSearchQuery.toLowerCase();

    // Exact match bonuses
    if (titleLower === searchLower) score += 1000;
    if (originalTitleLower === searchLower) score += 800;

    // Remove common words
    const commonWords = [
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'of',
    ];
    const cleanSearchTerms = searchTerms.filter(
      (term) => !commonWords.includes(term.toLowerCase()),
    );

    // Calculate similarity scores
    const titleSimilarity = this.calculateSimilarity(searchLower, titleLower);
    const originalTitleSimilarity = this.calculateSimilarity(
      searchLower,
      originalTitleLower,
    );

    score += titleSimilarity * 500;
    score += originalTitleSimilarity * 300;

    // Word by word matching
    cleanSearchTerms.forEach((term) => {
      // Direct contains matches
      if (titleLower.includes(term.toLowerCase())) score += 50;
      if (originalTitleLower.includes(term.toLowerCase())) score += 40;
      if (plotLower.includes(term.toLowerCase())) score += 10;

      // Partial word matches
      const words = titleLower.split(' ');
      words.forEach((word) => {
        const wordSimilarity = this.calculateSimilarity(
          term.toLowerCase(),
          word,
        );
        if (wordSimilarity > 0.8) {
          // 80% similarity threshold
          score += wordSimilarity * 30;
        }
      });
    });

    // Handle specific patterns and common variations
    const patterns = [
      { search: /(\w+)\s*&\s*(\w+)/g, replace: '$1 and $2' },
      { search: /pt\.?\s*(\d+)/gi, replace: 'part $1' },
      { search: /[^\w\s]/g, replace: ' ' }, // Remove special characters
    ];

    let normalizedSearch = searchLower;
    let normalizedTitle = titleLower;

    patterns.forEach((pattern) => {
      normalizedSearch = normalizedSearch.replace(
        pattern.search,
        pattern.replace,
      );
      normalizedTitle = normalizedTitle.replace(
        pattern.search,
        pattern.replace,
      );
    });

    if (this.calculateSimilarity(normalizedSearch, normalizedTitle) > 0.8) {
      score += 200;
    }

    // Popularity and rating bonuses
    score += (title.popularity || 0) / 10;
    score += (title.imdbRating || 0) * 5;

    return score;
  }

  // Main Functions

  async findAll(query: FullSearchDto) {
    const {
      page = 1,
      limit = 5,
      search,
      type,
      genre,
      year,
      language,
      minRating,
      sortBy = 'releaseDate',
      sortOrder = SortOrder.DESC,
    } = query;

    // console.log('Query parameters in findAll:', query); // Debugging line

    if (search) {
      return this.searchTitles(query as FullSearchDto);
    }

    const skip = (page - 1) * limit;

    // Create filters based on the incoming query
    const filters = QueryFilters.createTitleFilters(query);

    console.log('Filters being applied:', filters); // Debugging line

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

    // console.log('Data returned from database:', data); // Debugging line

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
    const { genreIds, productionCompanyIds, certificationIds, ...titleData } =
      createTitleDto;

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
        production: {
          connect: productionCompanyIds.map((id) => ({ id })),
        },
        certification: {
          connect: certificationIds.map((id) => ({ id })),
        },
      },
      include: {
        genres: true,
        production: true,
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
