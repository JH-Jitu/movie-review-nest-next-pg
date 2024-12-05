// src/recommendations/recommendation.controller.ts
import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RecommendationService } from './recommendation.service';

@ApiTags('recommendations')
@Controller('recommendations')
@UseGuards(JwtAuthGuard)
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('personalized')
  @ApiOperation({ summary: 'Get personalized recommendations' })
  getPersonalizedRecommendations(@Request() req) {
    return this.recommendationService.getPersonalizedRecommendations(
      req.user.id,
    );
  }

  @Get('title/:id/similar')
  @ApiOperation({ summary: 'Get similar titles' })
  getSimilarTitles(@Param('id') titleId: string) {
    return this.recommendationService.getSimilarTitles(titleId);
  }

  @Get('genre/:name')
  @ApiOperation({ summary: 'Get popular titles in genre' })
  getPopularInGenre(@Param('name') genreName: string) {
    return this.recommendationService.getPopularInGenre(genreName);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending titles' })
  getTrendingTitles() {
    return this.recommendationService.getTrendingTitles();
  }
}
