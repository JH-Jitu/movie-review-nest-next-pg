// src/genre/genre.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GenreService } from './genre.service';

@ApiTags('genres')
@Controller('genres')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create genre' })
  create(@Body() createGenreDto: { name: string }) {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  findAll() {
    return this.genreService.findAll();
  }
}
