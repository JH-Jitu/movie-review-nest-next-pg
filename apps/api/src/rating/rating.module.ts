// src/rating/rating.module.ts
import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RatingService } from './rating.service';

@Module({
  controllers: [RatingController],
  providers: [RatingService, PrismaService],
  exports: [RatingService],
})
export class RatingModule {}
