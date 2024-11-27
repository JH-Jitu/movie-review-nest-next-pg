// src/production-company/production-company.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductionCompanyDto } from './production-company.dto';
@Injectable()
export class ProductionCompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductionCompanyDto: CreateProductionCompanyDto) {
    const existing = await this.prisma.productionCompany.findUnique({
      where: { name: createProductionCompanyDto.name },
    });

    if (existing) {
      throw new ConflictException('Production company already exists');
    }

    return this.prisma.productionCompany.create({
      data: createProductionCompanyDto,
    });
  }

  async findAll() {
    return this.prisma.productionCompany.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
