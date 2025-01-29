import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/common/utils/file-upload.util';
import { ReviewService } from 'src/review/review.service';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [ReviewModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, FileUploadService, ReviewService],
  exports: [UserService],
})
export class UserModule {}
