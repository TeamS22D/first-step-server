import { 
    Controller,
    Get, 
    Param, 
    Post, 
    Body
} from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthDTO } from 'src/auth/dto/auth-dto';

@Controller('mail')
export class MailController {
    constructor(
        private readonly mailService: MailService,
    ) {}

    @Post(':email')
    async sendEmail(@Param('email') email: string) {
        return await this.mailService.sendEmail(email);
    }

    @Get('/verificationCodeEmail')
    async emailCertified(@Body() authDTO: AuthDTO.VerifedCodeEmail) {
        return await this.mailService.verifyCode(authDTO);
    }
}
