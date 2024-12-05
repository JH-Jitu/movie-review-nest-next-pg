import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

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
