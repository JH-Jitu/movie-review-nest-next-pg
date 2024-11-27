import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CertificationType } from '@prisma/client';

export class CreateCertificationDto {
  @ApiProperty({ enum: CertificationType })
  @IsEnum(CertificationType)
  type: CertificationType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;
}
