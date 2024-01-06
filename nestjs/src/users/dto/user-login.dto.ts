import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty({ example: 'jkl154527@gmail.com', description: '이메일' })
  email: string;

  @ApiProperty({ example: 'test password', description: '비밀번호' })
  password: string;
}
