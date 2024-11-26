import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/common/utils/file-upload.util';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, FileUploadService],
  exports: [UserService],
})
export class UserModule {}
