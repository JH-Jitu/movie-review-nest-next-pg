// src/review/review.module.ts
import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService],
  exports: [ReviewService],
})
export class ReviewModule {}
