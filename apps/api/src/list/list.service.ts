// src/list/list.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto, SortOrder } from '../common/dto/pagination.dto';
import {
  CreateListDto,
  CreateListItemDto,
  UpdateListDto,
  UpdateListItemDto,
} from './list.dto';

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = query;
    const skip = (page - 1) * limit;

    const where = {
      isPublic: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { user: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.list.findMany({
        where,
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
              items: true,
            },
          },
        },
      }),
      this.prisma.list.count({ where }),
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

  async findUserLists(userId: number, query: PaginationQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.list.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
      }),
      this.prisma.list.count({ where: { userId } }),
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

  async findOne(userId: number, id: string) {
    const list = await this.prisma.list.findUnique({
      where: { id },
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
            items: true,
          },
        },
      },
    });

    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }

    if (!list.isPublic && list.userId !== userId) {
      throw new ForbiddenException('This list is private');
    }

    return list;
  }

  async create(userId: number, createListDto: CreateListDto) {
    return this.prisma.list.create({
      data: {
        ...createListDto,
        userId,
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });
  }

  async update(userId: number, id: string, updateListDto: UpdateListDto) {
    const list = await this.findOne(userId, id);

    if (list.userId !== userId) {
      throw new ForbiddenException('You can only update your own lists');
    }

    return this.prisma.list.update({
      where: { id },
      data: updateListDto,
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });
  }

  async remove(userId: number, id: string) {
    const list = await this.findOne(userId, id);

    if (list.userId !== userId) {
      throw new ForbiddenException('You can only delete your own lists');
    }

    return this.prisma.list.delete({ where: { id } });
  }

  // List Items
  async getItems(userId: number, listId: string, query: PaginationQueryDto) {
    const list = await this.findOne(userId, listId);
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.listItem.findMany({
        where: { listId },
        skip,
        take: limit,
        orderBy: { order: 'asc' },
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
      this.prisma.listItem.count({ where: { listId } }),
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

  async addItem(
    userId: number,
    listId: string,
    createListItemDto: CreateListItemDto,
  ) {
    const list = await this.findOne(userId, listId);

    if (list.userId !== userId) {
      throw new ForbiddenException('You can only add items to your own lists');
    }

    // Check if title already exists in the list
    const existingItem = await this.prisma.listItem.findFirst({
      where: {
        listId,
        titleId: createListItemDto.titleId,
      },
    });

    if (existingItem) {
      throw new BadRequestException('This title is already in the list');
    }

    return this.prisma.listItem.create({
      data: {
        ...createListItemDto,
        listId,
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

  async updateItem(
    userId: number,
    listId: string,
    itemId: string,
    updateListItemDto: UpdateListItemDto,
  ) {
    const list = await this.findOne(userId, listId);

    if (list.userId !== userId) {
      throw new ForbiddenException(
        'You can only update items in your own lists',
      );
    }

    return this.prisma.listItem.update({
      where: { id: itemId },
      data: updateListItemDto,
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

  async removeItem(userId: number, listId: string, itemId: string) {
    const list = await this.findOne(userId, listId);

    if (list.userId !== userId) {
      throw new ForbiddenException(
        'You can only remove items from your own lists',
      );
    }

    return this.prisma.listItem.delete({ where: { id: itemId } });
  }
}
