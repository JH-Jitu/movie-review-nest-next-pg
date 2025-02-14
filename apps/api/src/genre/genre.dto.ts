// src/genre/dto/create-genre.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({
    example: 'Bangla',
    description: 'Movie Genre',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
