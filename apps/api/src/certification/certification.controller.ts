// src/certification/certification.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CertificationType } from '@prisma/client';
import { CertificationService } from './certification.service';

@ApiTags('certifications')
@Controller('certifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create certification' })
  create(
    @Body()
    createCertificationDto: {
      type: CertificationType;
      country: string;
    },
  ) {
    return this.certificationService.create(createCertificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all certifications' })
  findAll() {
    return this.certificationService.findAll();
  }
}
