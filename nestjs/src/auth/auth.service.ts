import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import authConfig from 'src/config/auth/authConfig';

interface User {
  id: string;
  name: string;
  email: string;
}

type Payload = (jwt.JwtPayload | string) & User;

@Injectable()
export class AuthService {
  constructor(@Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>) {}

  login(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: '1d',
      audience: 'example.com',
      issuer: 'example.com',
    });
  }

  verify(jwtString: string) {
    try {
      const { id, email } = jwt.verify(jwtString, this.config.jwtSecret) as Payload;

      return { userId: id, email };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
