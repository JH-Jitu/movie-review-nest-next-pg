import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFriendRequestDto {
  @ApiProperty({
    description: 'ID of the user to send friend request to',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  receiverId: number;
}

export class FriendRequestResponseDto {
  @ApiProperty({
    description: 'ID of the friend request',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the user who sent the request',
    example: 1,
  })
  senderId: number;

  @ApiProperty({
    description: 'ID of the user who received the request',
    example: 2,
  })
  receiverId: number;

  @ApiProperty({
    description: 'When the friend request was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
