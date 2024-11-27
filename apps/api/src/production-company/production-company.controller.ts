// src/production-company/production-company.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ProductionCompanyService } from './production-company.service';

@ApiTags('production-companies')
@Controller('production-companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductionCompanyController {
  constructor(
    private readonly productionCompanyService: ProductionCompanyService,
  ) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create production company' })
  create(
    @Body() createProductionCompanyDto: { name: string; country?: string },
  ) {
    return this.productionCompanyService.create(createProductionCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all production companies' })
  findAll() {
    return this.productionCompanyService.findAll();
  }
}
