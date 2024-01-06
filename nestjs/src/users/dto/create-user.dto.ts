import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @Transform((params) => params.value.trim())
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @ApiProperty({ example: '성석민', description: '이름' })
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  @ApiProperty({ example: 'jkl154527@gmail.com', description: '이메일' })
  readonly email: string;

  @ApiProperty({ example: 'test password', description: '비밀번호' })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
