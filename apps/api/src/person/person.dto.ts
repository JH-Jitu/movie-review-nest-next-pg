// person.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreatePersonDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  deathDate?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  birthPlace?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  height?: number;
}

export class UpdatePersonDto extends CreatePersonDto {}
