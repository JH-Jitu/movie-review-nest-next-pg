// src/list/list.controller.ts
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
  CreateListDto,
  CreateListItemDto,
  UpdateListDto,
  UpdateListItemDto,
} from './list.dto';
import { ListService } from './list.service';

@ApiTags('lists')
@Controller('lists')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  @ApiOperation({ summary: 'Get all public lists with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated lists' })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.listService.findAll(query);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user lists' })
  async getMyLists(@Request() req, @Query() query: PaginationQueryDto) {
    return this.listService.findUserLists(req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get list by id' })
  async findOne(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.listService.findOne(req.user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new list' })
  async create(@Request() req, @Body() createListDto: CreateListDto) {
    return this.listService.create(req.user.id, createListDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update list' })
  async update(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listService.update(req.user.id, id, updateListDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete list' })
  async remove(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.listService.remove(req.user.id, id);
  }

  // List Items
  @Get(':id/items')
  @ApiOperation({ summary: 'Get list items' })
  async getItems(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.listService.getItems(req.user.id, id, query);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add item to list' })
  async addItem(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createListItemDto: CreateListItemDto,
  ) {
    return this.listService.addItem(req.user.id, id, createListItemDto);
  }

  @Put(':id/items/:itemId')
  @ApiOperation({ summary: 'Update list item' })
  async updateItem(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() updateListItemDto: UpdateListItemDto,
  ) {
    return this.listService.updateItem(
      req.user.id,
      id,
      itemId,
      updateListItemDto,
    );
  }

  @Delete(':id/items/:itemId')
  @ApiOperation({ summary: 'Remove item from list' })
  async removeItem(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.listService.removeItem(req.user.id, id, itemId);
  }
}
