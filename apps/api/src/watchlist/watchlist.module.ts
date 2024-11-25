// src/watchlist/watchlist.module.ts
import { Module } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller';
import { PrismaService } from '../prisma/prisma.service';
import { WatchlistService } from './watchlist.service';

@Module({
  controllers: [WatchlistController],
  providers: [WatchlistService, PrismaService],
  exports: [WatchlistService],
})
export class WatchlistModule {}
