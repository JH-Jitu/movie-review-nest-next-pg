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
import { Prisma, Visibility } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto, userId?: number) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      currentUserId,
    } = query;
    const skip = (page - 1) * limit;

    const targetUserId = currentUserId ? Number(currentUserId) : userId;

    if (targetUserId) {
      // If we have a targetUserId, we only want:
      // 1. Reviews created by this user
      // 2. Reviews reposted by this user
      const [reviews, reposts] = await Promise.all([
        this.prisma.review.findMany({
          where: {
            userId: targetUserId,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                bio: true,
                location: true,
                website: true,
                role: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            title: true,
            _count: {
              select: {
                likes: true,
                comments: true,
                reposts: true,
                shares: true,
              },
            },
            likes: true,
            reposts: true,
          },
        }),
        this.prisma.repost.findMany({
          where: {
            userId: targetUserId,
          },
          include: {
            user: true,
            review: {
              include: {
                user: true,
                title: true,
                _count: {
                  select: {
                    likes: true,
                    comments: true,
                    reposts: true,
                    shares: true,
                  },
                },
              },
            },
          },
        }),
      ]);

      const combined = [
        ...reviews.map((review) => ({
          ...review,
          type: 'original',
          activityDate: review.createdAt,
        })),
        ...reposts.map((repost) => ({
          ...repost.review,
          type: 'repost',
          repostedBy: repost.user,
          repostComment: repost.comment,
          repostDate: repost.createdAt,
          repostVisibility: repost.visibility,
          activityDate: repost.createdAt, // Using repost date for sorting
        })),
      ].sort((a, b) =>
        sortOrder === SortOrder.DESC
          ? new Date(b.activityDate).getTime() -
            new Date(a.activityDate).getTime()
          : new Date(a.activityDate).getTime() -
            new Date(b.activityDate).getTime(),
      );

      const total = reviews.length + reposts.length;

      return {
        data: combined.slice(skip, skip + limit),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    // If no targetUserId, keep the existing public feed logic
    // ... existing code for public feed ...
    const reviewWhere = {
      OR: [
        { visibility: Visibility.PUBLIC },
        currentUserId && {
          userId: Number(currentUserId),
        },
        currentUserId && {
          visibility: Visibility.FRIENDS,
          user: {
            followers: {
              some: { id: Number(currentUserId) },
            },
          },
        },
      ].filter(Boolean),
    };

    // Base where clause for reposts
    const repostWhere = {
      OR: [
        { visibility: Visibility.PUBLIC },
        currentUserId && {
          userId: Number(currentUserId),
        },
        currentUserId && {
          visibility: Visibility.FRIENDS,
          user: {
            followers: {
              some: { id: Number(currentUserId) },
            },
          },
        },
      ].filter(Boolean),
    };

    const [reviews, reposts] = await Promise.all([
      this.prisma.review.findMany({
        where: reviewWhere,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              bio: true,
              location: true,
              website: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          title: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              reposts: true,
              shares: true,
            },
          },
          likes: true,
          reposts: true,
        },
        orderBy: { [sortBy]: sortOrder === SortOrder.DESC ? 'desc' : 'asc' },
      }),
      this.prisma.repost.findMany({
        where: repostWhere,
        include: {
          user: true,
          review: {
            include: {
              user: true,
              title: true,
              _count: {
                select: {
                  likes: true,
                  comments: true,
                  reposts: true,
                  shares: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: sortOrder === SortOrder.DESC ? 'desc' : 'asc' },
      }),
    ]);

    const combined = [
      ...reviews.map((review) => ({
        ...review,
        type: 'original',
        activityDate: review.createdAt,
      })),
      ...reposts.map((repost) => ({
        ...repost.review,
        type: 'repost',
        repostedBy: repost.user,
        repostComment: repost.comment,
        repostDate: repost.createdAt,
        repostVisibility: repost.visibility,
        activityDate: repost.createdAt,
      })),
    ].sort((a, b) =>
      sortOrder === SortOrder.DESC
        ? new Date(b.activityDate).getTime() -
          new Date(a.activityDate).getTime()
        : new Date(a.activityDate).getTime() -
          new Date(b.activityDate).getTime(),
    );

    const paginatedData = combined.slice(skip, skip + limit);

    const [reviewCount, repostCount] = await Promise.all([
      this.prisma.review.count({ where: reviewWhere }),
      this.prisma.repost.count({ where: repostWhere }),
    ]);

    return {
      data: paginatedData,
      meta: {
        total: reviewCount + repostCount,
        reviewCount,
        repostCount,
        page,
        limit,
        totalPages: Math.ceil((reviewCount + repostCount) / limit),
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

  async remove(userId: number, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { user: true },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    if (review.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    // Delete all related records first
    await this.prisma.$transaction([
      this.prisma.comment.deleteMany({ where: { reviewId } }),
      this.prisma.like.deleteMany({ where: { reviewId } }),
      this.prisma.repost.deleteMany({ where: { reviewId } }),
      this.prisma.share.deleteMany({ where: { reviewId } }),
      this.prisma.review.delete({ where: { id: reviewId } }),
    ]);

    return { deleted: true };
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

  async toggleRepost(userId: number, reviewId: string, comment?: string) {
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
          comment,
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
