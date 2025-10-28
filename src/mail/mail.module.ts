import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import Redis from 'ioredis';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          auth: {
            user: process.env.EMAILADDRESS,
            pass: process.env.EMAILPASSWORD
          },
          secure: true
        },
        defaults: {
          from: `'Waa' <${process.env.EMAILADDRESS}>`,
        },
      }),
    }),
    UserModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [MailController],
  providers: [
    MailService,  // 한 번만!
    {
      provide: 'REDIS',  // 문자열 토큰 사용
      useFactory: () => {
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    }
  ]
})
export class MailModule {}