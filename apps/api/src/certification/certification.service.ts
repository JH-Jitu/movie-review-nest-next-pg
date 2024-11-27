// src/certification/certification.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificationDto } from './certification.dto';
@Injectable()
export class CertificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCertificationDto: CreateCertificationDto) {
    const existing = await this.prisma.certification.findFirst({
      where: {
        type: createCertificationDto.type,
        country: createCertificationDto.country,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Certification already exists for this country',
      );
    }

    return this.prisma.certification.create({
      data: createCertificationDto,
    });
  }

  async findAll() {
    return this.prisma.certification.findMany({
      orderBy: [{ country: 'asc' }, { type: 'asc' }],
    });
  }
}
