// src/user/user.controller.ts
import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FileUploadService } from '../common/utils/file-upload.util';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    const user = await this.userService.findOne(req.user.id);
    const { hashedRefreshToken, ...userWithoutToken } = user;

    return userWithoutToken;
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Put('me/password')
  @ApiOperation({ summary: 'Update password' })
  updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user.id, updatePasswordDto);
  }

  @Put('me/avatar')
  @UseInterceptors(
    FileInterceptor(
      'file',
      FileUploadService.createMulterOptions('./uploads/avatars'),
    ),
  )
  @ApiOperation({ summary: 'Update avatar' })
  async updateAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('useCloudinary') useCloudinary: boolean = false, //TODO: will be true - cloudinary config
  ) {
    console.log({ file });
    const result = await this.fileUploadService.uploadFile(file, {
      useCloudinary,
      folder: 'avatars',
    });
    return this.userService.updateAvatar(req.user.id, result.url);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile by ID' })
  async getUserProfile(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Get user followers' })
  getFollowers(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.userService.getFollowers(id, query);
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'Get users being followed' })
  getFollowing(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.userService.getFollowing(id, query);
  }

  @Put(':id/follow')
  @ApiOperation({ summary: 'Follow a user' })
  followUser(@Request() req, @Param('id', ParseIntPipe) id: number) {
    if (req.user.id === id) {
      throw new BadRequestException("You can't follow yourself");
    }
    return this.userService.followUser(req.user.id, id);
  }

  @Put(':id/unfollow')
  @ApiOperation({ summary: 'Unfollow a user' })
  unfollowUser(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.userService.unfollowUser(req.user.id, id);
  }

  @Get(':id/lists')
  @ApiOperation({ summary: 'Get user public lists' })
  getUserLists(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.userService.getUserLists(id, query);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get user reviews' })
  getUserReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.userService.getUserReviews(id, query);
  }

  @Get(':id/ratings')
  @ApiOperation({ summary: 'Get user ratings' })
  getUserRatings(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.userService.getUserRatings(id, query);
  }

  @Get(':id/watchlist')
  @ApiOperation({ summary: 'Get user public watchlist' })
  getUserWatchlist(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.userService.getUserWatchlist(id, query);
  }

  // Admin only endpoints
  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
