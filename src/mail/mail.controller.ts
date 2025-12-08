import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post(':email')
  @HttpCode(200)
  async sendEmail(@Param('email') email: string) {
    return await this.mailService.sendEmail(email);
  }

  @Get(':email/:verificationCode')
  async emailCertified(
    @Param('verificationCode') verificationCode: string,
    @Param('email') email: string,
  ) {
    return await this.mailService.verifyCode(verificationCode, email);
  }
}
