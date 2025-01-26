// src/review/review.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto, SortOrder } from '../common/dto/pagination.dto';
import {
  CreateCommentDto,
  CreateReviewDto,
  UpdateCommentDto,
  UpdateReviewDto,
} from './review.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto, currentUserId?: number) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = search
      ? {
          OR: [
            { content: { contains: search, mode: 'insensitive' } },
            {
              title: {
                primaryTitle: { contains: search, mode: 'insensitive' },
              },
            },
            { user: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder.toLowerCase() as Prisma.SortOrder,
        },
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
          _count: {
            select: {
              comments: true,
              likes: true,
              reposts: true,
              shares: true,
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          reposts: {
            select: {
              userId: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    // Transform the data to include isLiked and isReposted flags
    const transformedData = data.map((review) => ({
      ...review,
      isLiked: review.likes.some((like) => like.userId === currentUserId),
      isReposted: review.reposts.some(
        (repost) => repost.userId === currentUserId,
      ),
      likes: undefined, // Remove the likes array from response
      reposts: undefined, // Remove the reposts array from response
    }));

    return {
      data: transformedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async create(userId: number, createReviewDto: CreateReviewDto) {
    // Sanitize HTML content here if needed
    const sanitizedContent = createReviewDto.content;

    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        titleId: createReviewDto.titleId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this title');
    }

    return this.prisma.review.create({
      data: {
        ...createReviewDto,
        content: sanitizedContent,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async update(userId: number, id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);

    if (review.user.id !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async remove(userId: number, id: string) {
    const review = await this.findOne(id);

    if (review.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    return this.prisma.review.delete({ where: { id } });
  }

  // Comments
  async getComments(reviewId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10, sortOrder = SortOrder.ASC } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { reviewId },
        skip,
        take: limit,
        orderBy: {
          createdAt: sortOrder.toLowerCase() as Prisma.SortOrder,
        },
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
      this.prisma.comment.count({ where: { reviewId } }),
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

  async addComment(
    userId: number,
    reviewId: string,
    createCommentDto: CreateCommentDto,
  ) {
    await this.findOne(reviewId);

    return this.prisma.comment.create({
      data: {
        ...createCommentDto,
        userId,
        reviewId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async updateComment(
    userId: number,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: true,
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: updateCommentDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async removeComment(userId: number, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: true,
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({ where: { id: commentId } });
  }

  async toggleLike(userId: number, reviewId: string) {
    // First check if review exists
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    try {
      const existingLike = await this.prisma.like.findFirst({
        where: {
          userId,
          reviewId,
        },
      });

      if (existingLike) {
        await this.prisma.like.delete({
          where: { id: existingLike.id },
        });
        return { isLiked: false };
      }

      await this.prisma.like.create({
        data: {
          userId,
          reviewId,
        },
      });
      return { isLiked: true };
    } catch (error) {
      console.error('Toggle like error:', error);
      throw new InternalServerErrorException('Failed to process like action');
    }
  }

  async toggleRepost(userId: number, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    try {
      const existingRepost = await this.prisma.repost.findFirst({
        where: {
          userId,
          reviewId,
        },
      });

      if (existingRepost) {
        await this.prisma.repost.delete({
          where: { id: existingRepost.id },
        });
        return { isReposted: false };
      }

      await this.prisma.repost.create({
        data: {
          userId,
          reviewId,
        },
      });
      return { isReposted: true };
    } catch (error) {
      console.error('Toggle repost error:', error);
      throw new InternalServerErrorException('Failed to process repost action');
    }
  }

  async shareReview(userId: number, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    try {
      await this.prisma.share.create({
        data: {
          userId,
          reviewId,
        },
      });
      return { shared: true };
    } catch (error) {
      console.error('Share error:', error);
      throw new InternalServerErrorException('Failed to process share action');
    }
  }
}
