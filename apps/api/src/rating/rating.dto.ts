import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

// rating.dto.ts
export class CreateRatingDto {
  @ApiProperty()
  @IsString()
  titleId: string;

  @ApiProperty()
  @IsNumber()
  value: number;
}

export class UpdateRatingDto extends CreateRatingDto {}
