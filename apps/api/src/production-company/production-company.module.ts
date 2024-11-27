// src/production-company/production-company.module.ts
import { Module } from '@nestjs/common';
import { ProductionCompanyController } from './production-company.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProductionCompanyService } from './production-company.service';

@Module({
  controllers: [ProductionCompanyController],
  providers: [ProductionCompanyService, PrismaService],
  exports: [ProductionCompanyService],
})
export class ProductionCompanyModule {}
