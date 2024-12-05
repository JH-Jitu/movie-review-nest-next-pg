// src/crew/crew.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { CreateCrewMemberDto, UpdateCrewMemberDto } from './crew.dto';

@Injectable()
export class CrewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCrewMemberDto: CreateCrewMemberDto) {
    const { titleId, personId } = createCrewMemberDto;

    // Validate title and person exist
    const [title, person] = await Promise.all([
      this.prisma.title.findUnique({ where: { id: titleId } }),
      this.prisma.person.findUnique({ where: { id: personId } }),
    ]);

    if (!title)
      throw new NotFoundException(`Title with ID ${titleId} not found`);
    if (!person)
      throw new NotFoundException(`Person with ID ${personId} not found`);

    // Check if this crew member already exists in the same role
    const existingCrewMember = await this.prisma.crewMember.findFirst({
      where: {
        titleId,
        personId,
        role: createCrewMemberDto.role,
        department: createCrewMemberDto.department,
      },
    });

    if (existingCrewMember) {
      throw new BadRequestException(
        'This crew member already exists in this role',
      );
    }

    return this.prisma.crewMember.create({
      data: createCrewMemberDto,
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
      this.prisma.crewMember.findMany({
        skip,
        take: limit,
        orderBy: [{ department: 'asc' }, { role: 'asc' }],
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
      this.prisma.crewMember.count(),
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

  async update(id: string, updateCrewMemberDto: UpdateCrewMemberDto) {
    const crewMember = await this.prisma.crewMember.findUnique({
      where: { id },
    });

    if (!crewMember) {
      throw new NotFoundException(`Crew member with ID ${id} not found`);
    }

    return this.prisma.crewMember.update({
      where: { id },
      data: updateCrewMemberDto,
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
    const crewMember = await this.prisma.crewMember.findUnique({
      where: { id },
    });

    if (!crewMember) {
      throw new NotFoundException(`Crew member with ID ${id} not found`);
    }

    return this.prisma.crewMember.delete({ where: { id } });
  }
}
