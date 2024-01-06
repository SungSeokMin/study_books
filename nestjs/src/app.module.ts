import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/email-config';
import { validationSchema } from './config/email-validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import authConfig from './config/auth/authConfig';

@Module({
  imports: [
    UsersModule,

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'test',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [authConfig, emailConfig],
      isGlobal: true,
      validationSchema,
    }),
  ],
  providers: [],
})
export class AppModule {}
