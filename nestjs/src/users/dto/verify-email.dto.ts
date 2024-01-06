import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'test token', description: '토큰' })
  signupVerifyToken: string;
}
