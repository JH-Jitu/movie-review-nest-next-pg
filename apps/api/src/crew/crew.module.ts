// src/crew/crew.module.ts
import { Module } from '@nestjs/common';
import { CrewController } from './crew.controller';
import { CrewService } from './crew.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CrewController],
  providers: [CrewService, PrismaService],
  exports: [CrewService],
})
export class CrewModule {}
