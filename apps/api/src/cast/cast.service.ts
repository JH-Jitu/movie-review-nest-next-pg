// src/cast/cast.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { CreateCastMemberDto, UpdateCastMemberDto } from './cast.dto';

@Injectable()
export class CastService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCastMemberDto: CreateCastMemberDto) {
    const { titleId, personId } = createCastMemberDto;

    // Validate title and person exist
    const [title, person] = await Promise.all([
      this.prisma.title.findUnique({ where: { id: titleId } }),
      this.prisma.person.findUnique({ where: { id: personId } }),
    ]);

    if (!title)
      throw new NotFoundException(`Title with ID ${titleId} not found`);
    if (!person)
      throw new NotFoundException(`Person with ID ${personId} not found`);

    // Check if this cast member already exists
    const existingCastMember = await this.prisma.castMember.findFirst({
      where: {
        titleId,
        personId,
        character: createCastMemberDto.character,
      },
    });

    if (existingCastMember) {
      throw new BadRequestException(
        'This cast member already exists for this title',
      );
    }

    return this.prisma.castMember.create({
      data: createCastMemberDto,
      include: {
        person: {
          select: {
            name: true,
            photoUrl: true,
          },
        },
        title: {
          select: {
            primaryTitle: true,
          },
        },
      },
    });
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.castMember.findMany({
        skip,
        take: limit,
        orderBy: { order: 'asc' },
        include: {
          person: {
            select: {
              name: true,
              photoUrl: true,
            },
          },
          title: {
            select: {
              primaryTitle: true,
            },
          },
        },
      }),
      this.prisma.castMember.count(),
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

  async update(id: string, updateCastMemberDto: UpdateCastMemberDto) {
    const castMember = await this.prisma.castMember.findUnique({
      where: { id },
    });

    if (!castMember) {
      throw new NotFoundException(`Cast member with ID ${id} not found`);
    }

    return this.prisma.castMember.update({
      where: { id },
      data: updateCastMemberDto,
      include: {
        person: {
          select: {
            name: true,
            photoUrl: true,
          },
        },
        title: {
          select: {
            primaryTitle: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const castMember = await this.prisma.castMember.findUnique({
      where: { id },
    });

    if (!castMember) {
      throw new NotFoundException(`Cast member with ID ${id} not found`);
    }

    return this.prisma.castMember.delete({ where: { id } });
  }
}
