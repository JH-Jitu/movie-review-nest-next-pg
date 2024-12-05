// src/cast/cast.controller.ts
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
import { CastService } from './cast.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { CreateCastMemberDto, UpdateCastMemberDto } from './cast.dto';

@ApiTags('cast')
@Controller('cast')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CastController {
  constructor(private readonly castService: CastService) {}

  @Post()
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Add cast member' })
  @ApiResponse({ status: 201, description: 'Cast member added successfully' })
  create(@Body() createCastMemberDto: CreateCastMemberDto) {
    return this.castService.create(createCastMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cast members' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.castService.findAll(query);
  }

  @Put(':id')
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Update cast member' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCastMemberDto: UpdateCastMemberDto,
  ) {
    return this.castService.update(id, updateCastMemberDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Remove cast member' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.castService.remove(id);
  }
}
