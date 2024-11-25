import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

// review.dto.ts
export class CreateReviewDto {
  @ApiProperty()
  @IsString()
  titleId: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  spoilers?: boolean;
}

export class UpdateReviewDto extends CreateReviewDto {}

// comment.dto.ts
export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  reviewId: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class UpdateCommentDto extends CreateCommentDto {}
