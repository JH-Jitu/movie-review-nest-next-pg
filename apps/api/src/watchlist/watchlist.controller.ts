import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import {
  CreateWatchHistoryDto,
  CreateWatchlistDto,
  UpdateWatchHistoryDto,
  UpdateWatchlistDto,
  WatchlistQueryDto,
} from './watchlist.dto';
import { WatchlistService } from './watchlist.service';

@ApiTags('watchlist')
@Controller('watchlist')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user watchlist' })
  @ApiResponse({ status: 200, description: 'Returns paginated watchlist' })
  async findAll(@Request() req, @Query() query: WatchlistQueryDto) {
    return this.watchlistService.findAll(req.user.id, query);
  }

  @Post()
  @ApiOperation({ summary: 'Add title to watchlist' })
  async create(@Request() req, @Body() createWatchlistDto: CreateWatchlistDto) {
    return this.watchlistService.create(req.user.id, createWatchlistDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update watchlist item' })
  async update(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWatchlistDto: UpdateWatchlistDto,
  ) {
    return this.watchlistService.update(req.user.id, id, updateWatchlistDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove title from watchlist' })
  async remove(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.watchlistService.remove(req.user.id, id);
  }

  // Watch History
  @Get('history')
  @ApiOperation({ summary: 'Get watch history' })
  async getHistory(@Request() req, @Query() query: PaginationQueryDto) {
    return this.watchlistService.getHistory(req.user.id, query);
  }

  @Post('history')
  @ApiOperation({ summary: 'Add to watch history' })
  async addToHistory(
    @Request() req,
    @Body() createWatchHistoryDto: CreateWatchHistoryDto,
  ) {
    return this.watchlistService.addToHistory(
      req.user.id,
      createWatchHistoryDto,
    );
  }

  @Put('history/:id')
  @ApiOperation({ summary: 'Update watch history entry' })
  async updateHistory(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWatchHistoryDto: UpdateWatchHistoryDto,
  ) {
    return this.watchlistService.updateHistory(
      req.user.id,
      id,
      updateWatchHistoryDto,
    );
  }

  @Delete('history/:id')
  @ApiOperation({ summary: 'Remove from watch history' })
  async removeFromHistory(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.watchlistService.removeFromHistory(req.user.id, id);
  }
}
