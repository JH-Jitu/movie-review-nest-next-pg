// watchlist.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WatchStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

export class CreateWatchlistDto {
  @ApiProperty()
  @IsString()
  titleId: string;

  @ApiProperty({ enum: WatchStatus, default: WatchStatus.WANT_TO_WATCH })
  @IsEnum(WatchStatus)
  @IsOptional()
  status?: WatchStatus;
}

export class UpdateWatchlistDto extends CreateWatchlistDto {}

// watch-history.dto.ts
export class CreateWatchHistoryDto {
  @ApiProperty()
  @IsString()
  titleId: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  progress?: number;
}

export class UpdateWatchHistoryDto extends CreateWatchHistoryDto {}

export class WatchlistQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: WatchStatus })
  @IsEnum(WatchStatus)
  @IsOptional()
  status?: WatchStatus;
}
