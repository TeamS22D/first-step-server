import { Controller, Get, Param, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { UserService } from 'src/user/user.service';

@Controller('mail')
export class MailController {
    constructor(
        private readonly mailService: MailService,
        private readonly userService: UserService,
    ) {}

    @Post(':email')
    async sendEmail(@Param('email') email: string) {
        return await this.mailService.sendEmail(email);
    }

    @Get(':verificationCode/:email')
    async emailCertified(
        @Param('verificationCode') verificationCode: string,
        @Param('email') email: string,
    ) {
        return await this.mailService.verifyCode(verificationCode, email);
    }
}
