import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          auth: {
            user: configService.getOrThrow<string>('EMAIL_ADDRESS'),
            pass: configService.getOrThrow<string>('EMAIL_PASS')
          },
          secure: true
        },
        defaults: {
          from: `'Waa' <${configService.getOrThrow<string>('EMAIL_ADDRESS')}>`,
        },
      }),
    }),
    UserModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [MailController],
  providers: [
    MailService,
    {
      provide: 'REDIS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: configService.getOrThrow<number>('REDIS_PORT'),
        });
      },
    }
  ]
})
export class MailModule {}