import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'jitu2@gmail.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    example: 'Jitu@123',
    description: 'User password',
  })
  password: string;
}
