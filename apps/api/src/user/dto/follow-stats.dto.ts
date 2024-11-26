// src/user/dto/follow-stats.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class FollowStatsResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  bio?: string;
}
