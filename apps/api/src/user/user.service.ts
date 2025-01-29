// src/user/user.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { hash, verify } from 'argon2';
import { ReviewService } from '../review/review.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reviewService: ReviewService,
  ) {}

  // Core User Methods
  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await hash(password);
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOne(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        hashedRefreshToken: true, // Add this
        _count: {
          select: {
            followers: true,
            following: true,
            reviews: true,
            ratings: true,
            lists: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    await this.findOne(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            reviews: true,
            ratings: true,
            lists: true,
          },
        },
      },
    });
  }

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isPasswordValid = await verify(
      user.password,
      updatePasswordDto.currentPassword,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await hash(updatePasswordDto.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async updateAvatar(userId: number, avatarUrl: string) {
    await this.findOne(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        avatar: true,
      },
    });
  }

  async remove(userId: number) {
    await this.findOne(userId);

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  // Auth Related Methods
  async updateHashedRefreshToken(userId: number, hashedRT: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashedRT },
    });
  }

  // Follow System Methods
  async followUser(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new BadRequestException("You can't follow yourself");
    }

    const userToFollow = await this.findOne(followingId);
    if (!userToFollow) {
      throw new NotFoundException('User to follow not found');
    }

    // Check if already following
    const existingFollow = await this.prisma.user.findFirst({
      where: {
        id: followerId,
        following: {
          some: {
            id: followingId,
          },
        },
      },
    });

    if (existingFollow) {
      throw new BadRequestException('You are already following this user');
    }

    return this.prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          connect: { id: followingId },
        },
      },
      select: {
        _count: {
          select: {
            following: true,
          },
        },
      },
    });
  }

  async unfollowUser(followerId: number, followingId: number) {
    const existingFollow = await this.prisma.user.findFirst({
      where: {
        id: followerId,
        following: {
          some: {
            id: followingId,
          },
        },
      },
    });

    if (!existingFollow) {
      throw new BadRequestException('You are not following this user');
    }

    return this.prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          disconnect: { id: followingId },
        },
      },
      select: {
        _count: {
          select: {
            following: true,
          },
        },
      },
    });
  }

  // User Content Methods
  async getUserLists(userId: number, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      isPublic: true,
    };

    const [data, total] = await Promise.all([
      this.prisma.list.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
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

  async getUserReviews(userId: number, query: PaginationQueryDto) {
    // Reuse the review service
    return this.reviewService.findAll(query, userId);
  }

  async getUserRatings(userId: number, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.rating.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          title: {
            select: {
              id: true,
              primaryTitle: true,
              posterUrl: true,
              titleType: true,
            },
          },
        },
      }),
      this.prisma.rating.count({ where: { userId } }),
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

  async getUserWatchlist(userId: number, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.watchlist.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { addedAt: 'desc' },
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
      this.prisma.watchlist.count({ where: { userId } }),
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

  async getFollowers(userId: number, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          followers: {
            skip,
            take: limit,
            select: {
              id: true,
              name: true,
              avatar: true,
              bio: true,
            },
          },
        },
      }),
      this.prisma.user.count({
        where: {
          following: {
            some: { id: userId },
          },
        },
      }),
    ]);

    if (!data) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      data: data.followers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFollowing(userId: number, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          following: {
            skip,
            take: limit,
            select: {
              id: true,
              name: true,
              avatar: true,
              bio: true,
            },
          },
        },
      }),
      this.prisma.user.count({
        where: {
          followers: {
            some: { id: userId },
          },
        },
      }),
    ]);

    if (!data) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      data: data.following,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Friend System Methods
  async sendFriendRequest(senderId: number, receiverId: number) {
    if (senderId === receiverId) {
      throw new BadRequestException(
        "You can't send a friend request to yourself",
      );
    }

    const receiver = await this.findOne(receiverId);
    if (!receiver) {
      throw new NotFoundException('User not found');
    }

    // Check if they are already friends
    const existingFriendship = await this.prisma.user.findFirst({
      where: {
        id: senderId,
        friends: {
          some: {
            id: receiverId,
          },
        },
      },
    });

    if (existingFriendship) {
      throw new BadRequestException('You are already friends with this user');
    }

    // Check if there's already a pending request
    const existingRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existingRequest) {
      throw new BadRequestException(
        'A friend request already exists between you and this user',
      );
    }

    return this.prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
      },
    });
  }

  async acceptFriendRequest(userId: number, requestId: string) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    if (request.receiverId !== userId) {
      throw new BadRequestException('This friend request was not sent to you');
    }

    // Create friendship connection and delete the request
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: request.receiverId },
        data: {
          friends: {
            connect: { id: request.senderId },
          },
        },
      }),
      this.prisma.user.update({
        where: { id: request.senderId },
        data: {
          friends: {
            connect: { id: request.receiverId },
          },
        },
      }),
      this.prisma.friendRequest.delete({
        where: { id: requestId },
      }),
    ]);

    return { message: 'Friend request accepted' };
  }

  async rejectFriendRequest(userId: number, requestId: string) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    if (request.receiverId !== userId) {
      throw new BadRequestException('This friend request was not sent to you');
    }

    await this.prisma.friendRequest.delete({
      where: { id: requestId },
    });

    return { message: 'Friend request rejected' };
  }

  async cancelFriendRequest(userId: number, requestId: string) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    if (request.senderId !== userId) {
      throw new BadRequestException('You did not send this friend request');
    }

    await this.prisma.friendRequest.delete({
      where: { id: requestId },
    });

    return { message: 'Friend request cancelled' };
  }

  async removeFriend(userId: number, friendId: number) {
    const existingFriendship = await this.prisma.user.findFirst({
      where: {
        id: userId,
        friends: {
          some: {
            id: friendId,
          },
        },
      },
    });

    if (!existingFriendship) {
      throw new BadRequestException('You are not friends with this user');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          friends: {
            disconnect: { id: friendId },
          },
        },
      }),
      this.prisma.user.update({
        where: { id: friendId },
        data: {
          friends: {
            disconnect: { id: userId },
          },
        },
      }),
    ]);

    return { message: 'Friend removed successfully' };
  }

  async getFriendRequests(userId: number, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.friendRequest.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.friendRequest.count({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      }),
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

  async getFriends(userId: number, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        friends: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            _count: {
              select: {
                friends: true,
              },
            },
          },
          skip,
          take: limit,
        },
        _count: {
          select: {
            friends: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      data: user.friends,
      meta: {
        total: user._count.friends,
        page,
        limit,
        totalPages: Math.ceil(user._count.friends / limit),
      },
    };
  }

  async getFriendStatus(userId: number, otherUserId: number) {
    if (userId === otherUserId) {
      return { status: 'SELF' };
    }

    // Check if they are friends
    const areFriends = await this.prisma.user.findFirst({
      where: {
        id: userId,
        friends: {
          some: {
            id: otherUserId,
          },
        },
      },
    });

    if (areFriends) {
      return { status: 'FRIENDS' };
    }

    // Check for pending friend requests
    const pendingRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
    });

    if (pendingRequest) {
      if (pendingRequest.senderId === userId) {
        return { status: 'REQUEST_SENT', requestId: pendingRequest.id };
      } else {
        return { status: 'REQUEST_RECEIVED', requestId: pendingRequest.id };
      }
    }

    return { status: 'NOT_FRIENDS' };
  }
}
