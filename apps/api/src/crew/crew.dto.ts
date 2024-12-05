import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
