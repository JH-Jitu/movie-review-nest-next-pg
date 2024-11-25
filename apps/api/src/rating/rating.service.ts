// src/rating/rating.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto, SortOrder } from '../common/dto/pagination.dto';
import { CreateRatingDto, UpdateRatingDto } from './rating.dto';

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.rating.findMany({
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
          title: {
            select: {
              id: true,
              primaryTitle: true,
              posterUrl: true,
            },
          },
        },
      }),
      this.prisma.rating.count(),
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

  async create(userId: number, createRatingDto: CreateRatingDto) {
    // Check if user already rated this title
    const existingRating = await this.prisma.rating.findUnique({
      where: {
        titleId_userId: {
          titleId: createRatingDto.titleId,
          userId,
        },
      },
    });

    if (existingRating) {
      throw new BadRequestException('You have already rated this title');
    }

    const rating = await this.prisma.rating.create({
      data: {
        ...createRatingDto,
        userId,
      },
      include: {
        title: true,
      },
    });

    // Update title's average rating
    await this.updateTitleRating(rating.titleId);

    return rating;
  }

  async update(userId: number, id: string, updateRatingDto: UpdateRatingDto) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    if (rating.user.id !== userId) {
      throw new ForbiddenException('You can only update your own ratings');
    }

    const updatedRating = await this.prisma.rating.update({
      where: { id },
      data: updateRatingDto,
      include: {
        title: true,
      },
    });

    // Update title's average rating
    await this.updateTitleRating(updatedRating.titleId);

    return updatedRating;
  }

  async remove(userId: number, id: string) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    if (rating.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own ratings');
    }

    const deletedRating = await this.prisma.rating.delete({ where: { id } });

    // Update title's average rating
    await this.updateTitleRating(deletedRating.titleId);

    return deletedRating;
  }

  private async updateTitleRating(titleId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { titleId },
      select: { value: true },
    });

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.value, 0) /
          ratings.length
        : 0;

    await this.prisma.title.update({
      where: { id: titleId },
      data: {
        imdbRating: averageRating,
        numVotes: ratings.length,
      },
    });
  }
}
