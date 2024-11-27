// title.dto.ts
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
import { TitleType } from '@prisma/client';
import { Type } from 'class-transformer';

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

  @ApiProperty({ required: false })
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
