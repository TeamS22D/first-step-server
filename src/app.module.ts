import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'qick',
      password: process.env.SQL_SECRET,
      database: 'qick',
      entities: [UserEntity],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }