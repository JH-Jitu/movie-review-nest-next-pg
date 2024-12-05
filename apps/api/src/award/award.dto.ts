import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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
