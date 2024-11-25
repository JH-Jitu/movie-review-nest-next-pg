// src/person/person.controller.ts
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
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { FileUploadService } from '../common/utils/file-upload.util';
import { CreatePersonDto, UpdatePersonDto } from './person.dto';
import { PersonService } from './person.service';

@ApiTags('persons')
@Controller('persons')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PersonController {
  constructor(
    private readonly personService: PersonService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all persons with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated persons' })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.personService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get person by id' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.personService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Create new person' })
  async create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Put(':id')
  @Roles('ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Update person' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return this.personService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete person' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.personService.remove(id);
  }

  @Post(':id/photo')
  @Roles('ADMIN', 'MODERATOR')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload person photo' })
  async uploadPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('useCloudinary') useCloudinary: boolean = true,
  ) {
    const result = await this.fileUploadService.uploadFile(file, {
      useCloudinary,
      folder: 'persons',
    });
    return this.personService.updatePhoto(id, result.url);
  }

  @Get(':id/titles')
  @ApiOperation({ summary: 'Get person titles (filmography)' })
  async getTitles(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.personService.getTitles(id, query);
  }

  @Get(':id/awards')
  @ApiOperation({ summary: 'Get person awards' })
  async getAwards(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.personService.getAwards(id, query);
  }
}
