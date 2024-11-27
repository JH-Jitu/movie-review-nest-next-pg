// src/certification/certification.module.ts
import { Module } from '@nestjs/common';
import { CertificationController } from './certification.controller';
import { CertificationService } from './certification.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CertificationController],
  providers: [CertificationService, PrismaService],
  exports: [CertificationService],
})
export class CertificationModule {}
