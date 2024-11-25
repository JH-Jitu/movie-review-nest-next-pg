import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'User email',
  })
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  password: string;
}
