import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import * as uuid from 'uuid';
import { EmailService } from '../email/email.service';
import { UserInfoDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  async createUser(user: CreateUserDto) {
    const { name, email, password } = user;

    const userExist = await this.checkUserExists(email);
    if (userExist) throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');

    const signupVerifyToken = uuid.v1();

    await this.saveUserUsingTransaction(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { signupVerifyToken } });
    if (!user) throw new NotFoundException('유저가 존재하지 않습니다.');

    const { id, name, email } = user;
    return this.authService.login({ id, name, email });
  }

  async login(emailAddress: string, password: string): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { email: emailAddress, password } });
    if (!user) throw new NotFoundException('유저가 존재하지 않습니다.');

    const { id, name, email } = user;
    return this.authService.login({ id, name, email });
  }

  async getUserInfo(userId: string): Promise<UserInfoDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('유저가 존재하지 않습니다.');

    return user;
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email: emailAddress } });

    return user !== null;
  }

  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = uuid.v1();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);

      // throw new InternalServerErrorException();
    });
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    return this.emailService.sendMemberJoinVerification(email, signupVerifyToken); // DB 연동 후 구현
  }
}
