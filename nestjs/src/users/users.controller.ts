import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInfoDto } from './dto/user.dto';

import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('유저 API')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    this.printLoggerServiceLog(dto);

    await this.usersService.createUser(dto);
  }

  @Post('/email-verify')
  @ApiOperation({ summary: '이메일 인증 API', description: '이메일을 인증한다.' })
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  @ApiOperation({ summary: '로그인 API', description: '로그인을 한다.' })
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @Get('/:id')
  @ApiOperation({ summary: '특정 유저 조회 API', description: '특정 유저를 조회한다.' })
  @ApiResponse({ status: 200, type: UserInfoDto })
  async getUserInfo(@Param('id') userId: string): Promise<UserInfoDto> {
    return this.usersService.getUserInfo(userId);
  }

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException(test);
    } catch (error) {
      this.logger.error('error: ' + JSON.stringify(dto), error.stack);
    }

    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }
}
