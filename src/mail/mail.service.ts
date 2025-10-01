import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class MailService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepositorye : Repository<UserEntity>,
        private readonly userService: UserService,
        private readonly mailerService: MailerService,
    ) {}

    async sendEmail(email: string) {
        const result = await this.userService.findByEmail(email);
        if (!result) {
            return {message: '존재하지 않는 이메일입니다'}
        }

        const temporaryCode = this.generateTemporaryCode();
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 5);

        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'test',
                html: `<p>인증코드: <strong>${temporaryCode}</strong>드립니다.</p>`,
            });

            await this.userRepositorye.update({email: email}, {verificationCode: temporaryCode, expirationTime: expirationTime});

            return { message: '인증코드를 전송했습니다.'};
        } catch (error) {
            console.error(error);
            return { message: '이메일 전송 중 오류가 발생했습니다.', error: error.message }
        }
    }

    private generateTemporaryCode(): string {
        const temporaryCode = randomBytes(3).toString('hex').toUpperCase();
        return temporaryCode;
    }

    async verifyCode(verificationCode: string, email: string) {
        const user = await this.userRepositorye.findOne({where: {email, verificationCode}});
        if (user && user.expirationTime > new Date()) {
            return { message: user.email};
        } else {
            return { message: '유효한 코드가 아닙니다'}
        }
    }
}
