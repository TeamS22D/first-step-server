import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailMission } from './entities/email-mission.entity';
import { Repository } from 'typeorm';
import { EmailMissionDTO } from './dto/email-mission-dto';

@Injectable()
export class EmailMissionService {
  constructor(
    @InjectRepository(EmailMission)
    private emailMissionRepository: Repository<EmailMission>,
  ) {}

  // 이거 유저가 처음 미션 들어오자 마자 실행
  async createEmailMission(Dto: EmailMissionDTO.createDTO) {
    const emailMission = this.emailMissionRepository.create(Dto);
    const saved = await this.emailMissionRepository.save(emailMission);
    return {
      emailMissionId: saved.emailMissionId,
      title: saved.title,
      receiver: saved.receiver,
      emailContent: saved.emailContent,
      userMIssionId: saved.userMission,
    };
  }

  async findEmailMission(emailMissionId: number) {
    const emailMission = await this.emailMissionRepository.findOne({
      where: { emailMissionId },
      relations: ['userMission'],
    });

    if (!emailMission) {
      throw new BadRequestException({
        message: '이메일 미션을 찾을 수 없습니다.',
      });
    }

    return {
      emailMissionId: emailMission.emailMissionId,
      title: emailMission.title,
      sendAt: emailMission.sendAt,
      receiver: emailMission.receiver,
      emailContent: emailMission.emailContent,
      userMissionId: emailMission.userMission.userMissionId,
      isSend: emailMission.isSend,
    };
  }

  // 이메일 업데이트
  async updateEmailMission(
    emailMissionId: number,
    Dto: EmailMissionDTO.updateDTO,
  ) {
    const exists = await this.emailMissionRepository.existsBy({
      emailMissionId,
    });

    if (!exists) {
      throw new BadRequestException({
        message: '이메일 미션을 찾을 수 없습니다.',
      });
    }

    const update = await this.emailMissionRepository.update(
      emailMissionId,
      Dto,
    );
    return {
      message: '이메일 업데이트',
      emailMissionId: emailMissionId,
      update: Dto,
    };
  }

  async deleteEmailMission(emailMissionId: number) {
    const exists = await this.emailMissionRepository.existsBy({
      emailMissionId,
    });

    if (!exists) {
      throw new BadRequestException({
        message: '이메일 미션을 찾을 수 없습니다.',
      });
    }

    const deleteEmailMission =
      this.emailMissionRepository.delete(emailMissionId);
    return {
      message: '이메일 미션 삭제',
      delete: emailMissionId,
    };
  }

  // 유저가 이메일 쓴 거 제출
  async sendEmail(emailMissionId: number, Dto: EmailMissionDTO.sendDTO) {
    const exists = await this.emailMissionRepository.existsBy({
      emailMissionId,
    });
    const sendAt = new Date();

    if (!exists) {
      throw new BadRequestException({ message: '이메일을 찾을 수 없습니다.' });
    }

    await this.emailMissionRepository.update(emailMissionId, {
      ...Dto,
      sendAt,
      isSend: true,
    });

    const result = {
      ...Dto,
      sendAt,
    };

    return {
      message: '이메일이 제출되었습니다.',
      send: result,
    };
  }

  // 유저가 이메일 쓴 거 저장
  async saveEmail(emailMissionId: number, Dto: EmailMissionDTO.sendDTO) {
    const exists = await this.emailMissionRepository.existsBy({
      emailMissionId,
    });
    const saveAt = new Date();

    if (!exists) {
      throw new BadRequestException({ message: '이메일을 찾을 수 없습니다.' });
    }

    await this.emailMissionRepository.update(emailMissionId, {
      ...Dto,
      saveAt,
    });

    const save = {
      ...Dto,
      saveAt,
    };

    return {
      message: '이메일이 저장되었습니다.',
      save: save,
    };
  }
}
