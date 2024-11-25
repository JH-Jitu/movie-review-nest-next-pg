import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto, SortOrder } from '../common/dto/pagination.dto';
import { QueryFilters } from '../common/filters/query-filter';
import { CreatePersonDto, UpdatePersonDto } from './person.dto';

@Injectable()
export class PersonService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'name',
      sortOrder = SortOrder.ASC,
    } = query;
    const skip = (page - 1) * limit;

    const filters = QueryFilters.createPersonFilters(query);

    const [data, total] = await Promise.all([
      this.prisma.person.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        include: {
          _count: {
            select: {
              castRoles: true,
              crewRoles: true,
              awards: true,
            },
          },
        },
      }),
      this.prisma.person.count({ where: filters }),
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
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            castRoles: true,
            crewRoles: true,
            awards: true,
          },
        },
      },
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return person;
  }

  async create(createPersonDto: CreatePersonDto) {
    return this.prisma.person.create({
      data: createPersonDto,
    });
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    await this.findOne(id);

    return this.prisma.person.update({
      where: { id },
      data: updatePersonDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.person.delete({ where: { id } });
  }

  async updatePhoto(id: string, photoUrl: string) {
    await this.findOne(id);
    return this.prisma.person.update({
      where: { id },
      data: { photoUrl },
    });
  }

  async getTitles(id: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [castRoles, crewRoles] = await Promise.all([
      this.prisma.castMember.findMany({
        where: { personId: id },
        include: { title: true },
        skip,
        take: limit,
      }),
      this.prisma.crewMember.findMany({
        where: { personId: id },
        include: { title: true },
        skip,
        take: limit,
      }),
    ]);

    const titles = [
      ...castRoles.map((r) => r.title),
      ...crewRoles.map((r) => r.title),
    ];
    const uniqueTitles = Array.from(
      new Map(titles.map((t) => [t.id, t])).values(),
    );

    return {
      data: uniqueTitles,
      meta: {
        total: uniqueTitles.length,
        page,
        limit,
      },
    };
  }

  async getAwards(id: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.award.findMany({
        where: { personId: id },
        skip,
        take: limit,
        orderBy: { year: 'desc' },
      }),
      this.prisma.award.count({ where: { personId: id } }),
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
}
