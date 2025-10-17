import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

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
  providers: [MailService, UserService]
})
export class MailModule {}
