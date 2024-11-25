// src/title/title.controller.ts
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
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
// import { RateLimit } from '../common/decorators/rate-limit.decorator';
// import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { FileUploadService } from '../common/utils/file-upload.util';
import {
  CreateEpisodeDto,
  CreateTitleDto,
  UpdateEpisodeDto,
  UpdateTitleDto,
} from './title.dto';
import { TitleService } from './title.service';

@ApiTags('titles')
@Controller('titles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TitleController {
  constructor(
    private readonly titleService: TitleService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all titles with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated titles' })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.titleService.findAll(query);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending titles' })
  async getTrending() {
    return this.titleService.getTrending();
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming releases' })
  async getUpcoming() {
    return this.titleService.getUpcoming();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get title by id' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.titleService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Create new title' })
  async create(@Body() createTitleDto: CreateTitleDto) {
    return this.titleService.create(createTitleDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Update title' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTitleDto: UpdateTitleDto,
  ) {
    return this.titleService.update(id, updateTitleDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete title' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.titleService.remove(id);
  }

  @Post(':id/poster')
  @Roles('ADMIN', 'MODERATOR')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload title poster' })
  async uploadPoster(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('useCloudinary') useCloudinary: boolean = true,
  ) {
    const result = await this.fileUploadService.uploadFile(file, {
      useCloudinary,
      folder: 'posters',
    });
    return this.titleService.updatePoster(id, result.url);
  }

  @Post(':id/backdrop')
  @Roles('ADMIN', 'MODERATOR')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload title backdrop' })
  async uploadBackdrop(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('useCloudinary') useCloudinary: boolean = true,
  ) {
    const result = await this.fileUploadService.uploadFile(file, {
      useCloudinary,
      folder: 'backdrops',
    });
    return this.titleService.updateBackdrop(id, result.url);
  }

  // Episodes
  @Get(':id/episodes')
  @ApiOperation({ summary: 'Get all episodes for a series' })
  async getEpisodes(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.titleService.findEpisodes(id, query);
  }

  @Post(':id/episodes')
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Add episode to series' })
  async addEpisode(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createEpisodeDto: CreateEpisodeDto,
  ) {
    return this.titleService.addEpisode(id, createEpisodeDto);
  }

  @Put('episodes/:episodeId')
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Update episode' })
  async updateEpisode(
    @Param('episodeId', ParseUUIDPipe) episodeId: string,
    @Body() updateEpisodeDto: UpdateEpisodeDto,
  ) {
    return this.titleService.updateEpisode(episodeId, updateEpisodeDto);
  }

  @Delete('episodes/:episodeId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete episode' })
  async removeEpisode(@Param('episodeId', ParseUUIDPipe) episodeId: string) {
    return this.titleService.removeEpisode(episodeId);
  }

  // Cast & Crew
  @Get(':id/cast')
  @ApiOperation({ summary: 'Get title cast' })
  async getCast(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.titleService.getCast(id, query);
  }

  @Get(':id/crew')
  @ApiOperation({ summary: 'Get title crew' })
  async getCrew(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.titleService.getCrew(id, query);
  }

  // Reviews & Ratings
  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get title reviews' })
  async getReviews(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.titleService.getReviews(id, query);
  }

  @Get(':id/ratings')
  @ApiOperation({ summary: 'Get title ratings' })
  async getRatings(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.titleService.getRatings(id, query);
  }
}
