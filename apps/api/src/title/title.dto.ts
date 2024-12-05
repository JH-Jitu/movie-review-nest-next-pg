// title.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsArray,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { TitleType } from '@prisma/client';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

export class CreateTitleDto {
  @ApiProperty({ enum: TitleType })
  @IsEnum(TitleType)
  titleType: TitleType;

  @ApiProperty()
  @IsString()
  primaryTitle: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  originalTitle?: string;

  @ApiProperty({
    required: false,
    type: Date,
    example: '2024-12-25', // ISO 8601 format
  })
  @Type(() => Date) // Transform string to Date
  @IsDate()
  @IsOptional()
  releaseDate?: Date;

  @ApiProperty()
  @IsString()
  plot: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  runtime?: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isReleased?: boolean;

  @ApiProperty()
  @IsString()
  originalLanguage: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  budget?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  revenue?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  imdbRating?: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  genreIds: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  productionCompanyIds: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  certificationIds: string[];
}

export class UpdateTitleDto extends CreateTitleDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  imdbRating?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  numVotes?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  popularity?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  popularityRank?: number;
}

// episode.dto.ts
export class CreateEpisodeDto {
  @ApiProperty()
  @IsString()
  seriesId: string;

  @ApiProperty()
  @IsNumber()
  seasonNumber: number;

  @ApiProperty()
  @IsNumber()
  episodeNumber: number;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  airDate?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  plot?: string;
}

export class UpdateEpisodeDto extends CreateEpisodeDto {}

// cast-member.dto.ts
export class CreateCastMemberDto {
  @ApiProperty()
  @IsString()
  titleId: string;

  @ApiProperty()
  @IsString()
  personId: string;

  @ApiProperty()
  @IsString()
  character: string;

  @ApiProperty()
  @IsNumber()
  order: number;
}

export class UpdateCastMemberDto extends CreateCastMemberDto {}

// crew-member.dto.ts
export class CreateCrewMemberDto {
  @ApiProperty()
  @IsString()
  titleId: string;

  @ApiProperty()
  @IsString()
  personId: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsString()
  department: string;
}

export class UpdateCrewMemberDto extends CreateCrewMemberDto {}

// award.dto.ts
export class CreateAwardDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isNomination?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isWinner?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  titleId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  personId?: string;
}

export class UpdateAwardDto extends CreateAwardDto {}

// src/title/dto/search.dto.ts
export class QuickSearchDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  query?: string;

  @ApiPropertyOptional({ enum: TitleType })
  @IsEnum(TitleType)
  @IsOptional()
  type?: TitleType;

  @ApiPropertyOptional()
  @IsOptional()
  limit: number = 5;
}

// src/title/dto/search.dto.ts
export class FullSearchDto {
  @ApiPropertyOptional({
    description: 'Search query',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: TitleType,
    enumName: 'TitleType',
    description: 'Filter by title type',
    example: TitleType.MOVIE,
  })
  @IsOptional()
  @IsEnum(TitleType)
  type?: TitleType;

  @ApiPropertyOptional({
    description: 'Filter by genre name',
    example: 'Action',
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({
    description: 'Filter by release year',
    example: '2023',
  })
  @IsOptional()
  @IsString()
  year?: string;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: 'Page number',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    description: 'Number of items per page',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'releaseDate',
    default: 'releaseDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'releaseDate';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: string = 'desc';
}
