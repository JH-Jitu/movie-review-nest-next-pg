import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { CreateAwardDto, UpdateAwardDto } from './award.dto';

@Injectable()
export class AwardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAwardDto: CreateAwardDto) {
    const { titleId, personId, ...awardData } = createAwardDto;

    // Validate that either titleId or personId is provided, but not both
    if ((titleId && personId) || (!titleId && !personId)) {
      throw new BadRequestException(
        'Provide either titleId or personId, not both or neither',
      );
    }

    // Check if title/person exists
    if (titleId) {
      const title = await this.prisma.title.findUnique({
        where: { id: titleId },
      });
      if (!title)
        throw new NotFoundException(`Title with ID ${titleId} not found`);
    }
    if (personId) {
      const person = await this.prisma.person.findUnique({
        where: { id: personId },
      });
      if (!person)
        throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    return this.prisma.award.create({
      data: {
        ...awardData,
        ...(titleId && { title: { connect: { id: titleId } } }),
        ...(personId && { person: { connect: { id: personId } } }),
      },
      include: {
        title: {
          select: {
            primaryTitle: true,
            titleType: true,
          },
        },
        person: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.award.findMany({
        skip,
        take: limit,
        orderBy: { year: 'desc' },
        include: {
          title: {
            select: {
              primaryTitle: true,
              titleType: true,
            },
          },
          person: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.award.count(),
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
    const award = await this.prisma.award.findUnique({
      where: { id },
      include: {
        title: {
          select: {
            primaryTitle: true,
            titleType: true,
          },
        },
        person: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!award) {
      throw new NotFoundException(`Award with ID ${id} not found`);
    }

    return award;
  }

  async update(id: string, updateAwardDto: UpdateAwardDto) {
    await this.findOne(id);
    const { titleId, personId, ...awardData } = updateAwardDto;

    // Similar validation as create
    if (titleId && personId) {
      throw new BadRequestException('Cannot update both titleId and personId');
    }

    if (titleId) {
      const title = await this.prisma.title.findUnique({
        where: { id: titleId },
      });
      if (!title)
        throw new NotFoundException(`Title with ID ${titleId} not found`);
    }
    if (personId) {
      const person = await this.prisma.person.findUnique({
        where: { id: personId },
      });
      if (!person)
        throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    return this.prisma.award.update({
      where: { id },
      data: {
        ...awardData,
        ...(titleId && { title: { connect: { id: titleId } } }),
        ...(personId && { person: { connect: { id: personId } } }),
      },
      include: {
        title: {
          select: {
            primaryTitle: true,
            titleType: true,
          },
        },
        person: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.award.delete({ where: { id } });
  }
}
