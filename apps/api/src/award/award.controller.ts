// src/award/award.controller.ts
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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AwardService } from './award.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { CreateAwardDto, UpdateAwardDto } from './award.dto';

@ApiTags('awards')
@Controller('awards')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AwardController {
  constructor(private readonly awardService: AwardService) {}

  @Post()
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Create new award' })
  @ApiResponse({ status: 201, description: 'Award created successfully' })
  create(@Body() createAwardDto: CreateAwardDto) {
    return this.awardService.create(createAwardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all awards' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.awardService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get award by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.awardService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Update award' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAwardDto: UpdateAwardDto,
  ) {
    return this.awardService.update(id, updateAwardDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Delete award' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.awardService.remove(id);
  }
}
