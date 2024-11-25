// src/rating/rating.controller.ts
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
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { CreateRatingDto, UpdateRatingDto } from './rating.dto';
import { RatingService } from './rating.service';

@ApiTags('ratings')
@Controller('ratings')
@UseGuards(JwtAuthGuard, RolesGuard, RateLimitGuard)
@ApiBearerAuth()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ratings with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated ratings' })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.ratingService.findAll(query);
  }

  @Post()
  @RateLimit(3600, 50) // 50 ratings per hour
  @ApiOperation({ summary: 'Create new rating' })
  async create(@Request() req, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.create(req.user.id, createRatingDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update rating' })
  async update(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    return this.ratingService.update(req.user.id, id, updateRatingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete rating' })
  async remove(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.ratingService.remove(req.user.id, id);
  }
}
