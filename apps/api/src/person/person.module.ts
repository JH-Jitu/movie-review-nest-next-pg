import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PrismaService } from '../prisma/prisma.service';
import { FileUploadService } from '../common/utils/file-upload.util';
import { PersonService } from './person.service';

@Module({
  controllers: [PersonController],
  providers: [PersonService, PrismaService, FileUploadService],
  exports: [PersonService],
})
export class PersonModule {}
