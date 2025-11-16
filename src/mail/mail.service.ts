import { MailerService } from '@nestjs-modules/mailer';

import { 
    Injectable, 
    BadRequestException, 
    InternalServerErrorException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { AuthDTO } from 'src/auth/dto/auth-dto';
import Redis from 'ioredis';

@Injectable()
export class MailService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository : Repository<UserEntity>,
        private readonly userService: UserService,
        private readonly mailerService: MailerService,
        @Inject('REDIS') private readonly redis: Redis
    ) {}

    // 이메일 코드 전송
    async sendEmail(email: string) {
        const result = await this.userService.findByEmail(email);

        if (!result) {
            throw new BadRequestException({ message: "존재하지 않는 이메일입니다" }); // 이메일이 존재하지 않다면
        }

        if (result.isVerified == true) {
            return { message: "이미 인증이 완료된 유저입니다." }; // 인증이 완료되었다면
        }

        const temporaryCode = this.generateTemporaryCode(6);

        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'first step 인증 코드',
                html: `<p>인증코드: <strong>${temporaryCode}</strong>드립니다.</p>`,
            });

            const RedisKey = `verification:${email}`;
            await this.redis.set(RedisKey, temporaryCode, 'EX', 300);

            return { message: "인증코드를 전송했습니다."}; 
        }

        catch (error) {
            console.error('에러 타입:', typeof error);
            console.error('에러 메시지:', error?.message);
            console.error('에러 스택:', error?.stack);
            console.error('전체 에러:', JSON.stringify(error, null, 2));
            
        throw new InternalServerErrorException({ 
            message: "이메일 전송 중 오류가 발생했습니다.",
            detail: error?.message || '알 수 없는 오류'}); // 이메일 코드 전송 도중 오류
        }
    }

    private generateTemporaryCode(length = 6): string {
        const bytes = Math.ceil(length / 2);
        return randomBytes(bytes).toString('hex').toUpperCase().slice(0, length);
    }

    // 이메일 코드 인증
    async verifyCode(authDTO: AuthDTO.VerifedCodeEmail) {

        const { email, verificationCode } = authDTO;
        const RedisKey = `verification:${email}`;
        const storedCode = await this.redis.get(RedisKey);
        const user = await this.userService.findByEmail(email)

        if (!user) {
            throw new BadRequestException({ message: "존재하지 않는 이메일입니다" }); // 이메일이 존재하지 않다면
        }

        if (!storedCode || storedCode !== verificationCode) {
            throw new BadRequestException({ message: "인증코드가 일치하지 않습니다." }); // 인증코드가 일치하지 않다면
        }

        await this.redis.del(RedisKey);
        await this.userRepository.update(user.id, { isVerified: true });

        return { message: "인증이 완료되었습니다" };
    }
}
