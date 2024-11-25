// src/list/list.module.ts
import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ListController],
  providers: [ListService, PrismaService],
  exports: [ListService],
})
export class ListModule {}
