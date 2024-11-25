// src/watchlist/watchlist.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto, SortOrder } from '../common/dto/pagination.dto';
import {
  CreateWatchHistoryDto,
  CreateWatchlistDto,
  UpdateWatchHistoryDto,
  UpdateWatchlistDto,
  WatchlistQueryDto,
} from './watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number, query: WatchlistQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'addedAt',
      sortOrder = SortOrder.DESC,
      status,
    } = query;
    const skip = (page - 1) * limit;

    const where = { userId };
    if (status) {
      where['status'] = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.watchlist.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        include: {
          title: {
            select: {
              id: true,
              primaryTitle: true,
              posterUrl: true,
              titleType: true,
              releaseDate: true,
            },
          },
        },
      }),
      this.prisma.watchlist.count({ where }),
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

  async create(userId: number, createWatchlistDto: CreateWatchlistDto) {
    const existingItem = await this.prisma.watchlist.findUnique({
      where: {
        userId_titleId: {
          userId,
          titleId: createWatchlistDto.titleId,
        },
      },
    });

    if (existingItem) {
      throw new BadRequestException('This title is already in your watchlist');
    }

    return this.prisma.watchlist.create({
      data: {
        ...createWatchlistDto,
        userId,
      },
      include: {
        title: {
          select: {
            id: true,
            primaryTitle: true,
            posterUrl: true,
            titleType: true,
            releaseDate: true,
          },
        },
      },
    });
  }

  async update(
    userId: number,
    id: string,
    updateWatchlistDto: UpdateWatchlistDto,
  ) {
    const watchlistItem = await this.prisma.watchlist.findFirst({
      where: { id, userId },
    });

    if (!watchlistItem) {
      throw new NotFoundException(`Watchlist item with ID ${id} not found`);
    }

    return this.prisma.watchlist.update({
      where: { id },
      data: updateWatchlistDto,
      include: {
        title: {
          select: {
            id: true,
            primaryTitle: true,
            posterUrl: true,
            titleType: true,
            releaseDate: true,
          },
        },
      },
    });
  }

  async remove(userId: number, id: string) {
    const watchlistItem = await this.prisma.watchlist.findFirst({
      where: { id, userId },
    });

    if (!watchlistItem) {
      throw new NotFoundException(`Watchlist item with ID ${id} not found`);
    }

    return this.prisma.watchlist.delete({ where: { id } });
  }

  // Watch History
  async getHistory(userId: number, query: PaginationQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'watchedAt',
      sortOrder = SortOrder.DESC,
    } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.watchHistory.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        include: {
          title: {
            select: {
              id: true,
              primaryTitle: true,
              posterUrl: true,
              titleType: true,
              releaseDate: true,
            },
          },
        },
      }),
      this.prisma.watchHistory.count({ where: { userId } }),
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

  async addToHistory(
    userId: number,
    createWatchHistoryDto: CreateWatchHistoryDto,
  ) {
    const lastWatch = await this.prisma.watchHistory.findFirst({
      where: {
        userId,
        titleId: createWatchHistoryDto.titleId,
      },
      orderBy: { watchedAt: 'desc' },
    });

    // If last watch was less than 30 minutes ago, update it instead of creating new
    if (
      lastWatch &&
      Date.now() - lastWatch.watchedAt.getTime() < 30 * 60 * 1000
    ) {
      return this.prisma.watchHistory.update({
        where: { id: lastWatch.id },
        data: {
          progress: createWatchHistoryDto.progress,
          watchedAt: new Date(),
        },
        include: {
          title: {
            select: {
              id: true,
              primaryTitle: true,
              posterUrl: true,
              titleType: true,
              releaseDate: true,
            },
          },
        },
      });
    }

    return this.prisma.watchHistory.create({
      data: {
        ...createWatchHistoryDto,
        userId,
      },
      include: {
        title: {
          select: {
            id: true,
            primaryTitle: true,
            posterUrl: true,
            titleType: true,
            releaseDate: true,
          },
        },
      },
    });
  }

  async updateHistory(
    userId: number,
    id: string,
    updateWatchHistoryDto: UpdateWatchHistoryDto,
  ) {
    const historyItem = await this.prisma.watchHistory.findFirst({
      where: { id, userId },
    });

    if (!historyItem) {
      throw new NotFoundException(`Watch history item with ID ${id} not found`);
    }

    return this.prisma.watchHistory.update({
      where: { id },
      data: updateWatchHistoryDto,
      include: {
        title: {
          select: {
            id: true,
            primaryTitle: true,
            posterUrl: true,
            titleType: true,
            releaseDate: true,
          },
        },
      },
    });
  }

  async removeFromHistory(userId: number, id: string) {
    const historyItem = await this.prisma.watchHistory.findFirst({
      where: { id, userId },
    });

    if (!historyItem) {
      throw new NotFoundException(`Watch history item with ID ${id} not found`);
    }

    return this.prisma.watchHistory.delete({ where: { id } });
  }
}
