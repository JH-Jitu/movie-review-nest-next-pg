import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

// list.dto.ts
export class CreateListDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class UpdateListDto extends CreateListDto {}

// list-item.dto.ts
export class CreateListItemDto {
  @ApiProperty()
  @IsString()
  listId: string;

  @ApiProperty()
  @IsString()
  titleId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty()
  @IsNumber()
  order: number;
}

export class UpdateListItemDto extends CreateListItemDto {}
