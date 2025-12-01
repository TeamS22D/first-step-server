import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailMission } from './entities/email-mission.entity';
import { Repository } from 'typeorm';
import { EmailMissionDTO } from './dto/email-mission-dto';

@Injectable()
export class EmailMissionService {
    constructor(@InjectRepository(EmailMission) private emailMissionRepository: Repository<EmailMission>) {}

    // 이거 유저가 email 보내는 거임
    async createEmailMission(Dto: EmailMissionDTO.createDTO) {
        return await this.emailMissionRepository.save(Dto);
    }

    async findEmailMission(emailMissionId: number) {
        const emailMission = await this.emailMissionRepository.findOne({ where: { emailMissionId } });

        if (!emailMission) {
            throw new BadRequestException({ message: "이메일 미션을 찾을 수 없습니다." })
        }

        return emailMission;
    }

    // 이건 유저가 저장 눌러서 저장하는 거임
    async updateEmailMission(emailMissionId: number, Dto: EmailMissionDTO.updateDTO) {
        const exists = await this.emailMissionRepository.existsBy({ emailMissionId })

        if (!exists) {
            throw new BadRequestException({ message: "이메일 미션을 찾을 수 없습니다." })
        }

        const update = await this.emailMissionRepository.update(emailMissionId, Dto);
        return { message: "이메일 업데이트", update: update };
    }

    async deleteEmailMission(emailMissionId: number) {
        const exists = await this.emailMissionRepository.existsBy({ emailMissionId })

        if (!exists) {
            throw new BadRequestException({ message: "이메일 미션을 찾을 수 없습니다." })
        }

        const deleteEmailMission = this.emailMissionRepository.delete(emailMissionId);
        return { message: "이메일 미션 삭제", delete: deleteEmailMission};
    }
}
