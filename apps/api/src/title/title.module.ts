// src/title/title.module.ts
import { Module } from '@nestjs/common';
import { TitleController } from './title.controller';
import { PrismaService } from '../prisma/prisma.service';
import { FileUploadService } from '../common/utils/file-upload.util';
import { TitleService } from './title.service';

@Module({
  controllers: [TitleController],
  providers: [TitleService, PrismaService, FileUploadService],
  exports: [TitleService],
})
export class TitleModule {}
