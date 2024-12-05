// src/award/award.module.ts
import { Module } from '@nestjs/common';
import { AwardService } from './award.service';
import { AwardController } from './award.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AwardController],
  providers: [AwardService, PrismaService],
  exports: [AwardService],
})
export class AwardModule {}
