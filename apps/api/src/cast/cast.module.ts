// src/cast/cast.module.ts
import { Module } from '@nestjs/common';
import { CastController } from './cast.controller';
import { CastService } from './cast.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CastController],
  providers: [CastService, PrismaService],
  exports: [CastService],
})
export class CastModule {}
