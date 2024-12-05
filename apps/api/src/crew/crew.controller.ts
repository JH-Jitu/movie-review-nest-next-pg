// src/crew/crew.controller.ts
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
import { CrewService } from './crew.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { CreateCrewMemberDto, UpdateCrewMemberDto } from './crew.dto';

@ApiTags('crew')
@Controller('crew')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CrewController {
  constructor(private readonly crewService: CrewService) {}

  @Post()
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Add crew member' })
  @ApiResponse({ status: 201, description: 'Crew member added successfully' })
  create(@Body() createCrewMemberDto: CreateCrewMemberDto) {
    return this.crewService.create(createCrewMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all crew members' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.crewService.findAll(query);
  }

  @Put(':id')
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Update crew member' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCrewMemberDto: UpdateCrewMemberDto,
  ) {
    return this.crewService.update(id, updateCrewMemberDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Remove crew member' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.crewService.remove(id);
  }
}
