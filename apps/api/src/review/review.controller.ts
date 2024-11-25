// src/review/review.controller.ts
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
import { Roles } from '../auth/decorators/roles.decorator';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import {
  CreateCommentDto,
  CreateReviewDto,
  UpdateCommentDto,
  UpdateReviewDto,
} from './review.dto';
import { ReviewService } from './review.service';

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard, RateLimitGuard)
@ApiBearerAuth()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated reviews' })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.reviewService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by id' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewService.findOne(id);
  }

  @Post()
  @RateLimit(3600, 5) // 5 reviews per hour
  @ApiOperation({ summary: 'Create new review' })
  async create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(req.user.id, createReviewDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update review' })
  async update(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(req.user.id, id, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete review' })
  async remove(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.reviewService.remove(req.user.id, id);
  }

  // Comments
  @Get(':id/comments')
  @ApiOperation({ summary: 'Get review comments' })
  async getComments(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.reviewService.getComments(id, query);
  }

  @Post(':id/comments')
  @RateLimit(3600, 20) // 20 comments per hour
  @ApiOperation({ summary: 'Add comment to review' })
  async addComment(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.reviewService.addComment(req.user.id, id, createCommentDto);
  }

  @Put('comments/:commentId')
  @ApiOperation({ summary: 'Update comment' })
  async updateComment(
    @Request() req,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.reviewService.updateComment(
      req.user.id,
      commentId,
      updateCommentDto,
    );
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: 'Delete comment' })
  async removeComment(
    @Request() req,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.reviewService.removeComment(req.user.id, commentId);
  }
}
