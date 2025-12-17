import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentMission } from './entities/document-mission.entity';
import { Repository } from 'typeorm';
import { DocumentMissionDto } from './dto/document-mission-dto';
import { InternalApiService } from '../internal-api/internal-api.service';
import { UserMissionService } from '../user-mission/user-mission.service';
import { RawGradingResult } from '../user-mission/dto/raw-grading-result.dto';

@Injectable()
export class DocumentMissionService {
  constructor(
    private readonly userMissionService: UserMissionService,
    private readonly internalApi: InternalApiService,
    @InjectRepository(DocumentMission)
    private documentMissionRepository: Repository<DocumentMission>,
  ) {}

  // 이거 유저가 처음 미션 들어오자 마자 실행
  async createDocumentMission(Dto: DocumentMissionDto.createDTO) {
    const { userMissionId, ...rest } = Dto;
    const documentMission = this.documentMissionRepository.create({
      ...rest,
      userMission: { userMissionId },
    });
    const saved = await this.documentMissionRepository.save(documentMission);
    return {
      documentMissionId: saved.documentMissionId,
      documentContent: saved.documentContent,
      userMissionId: saved.userMission,
    };
  }

  async findDocumentMission(documentMissionId: number) {
    const documentMission = await this.documentMissionRepository.findOne({
      where: { documentMissionId },
      relations: ['userMission'],
    });

    if (!documentMission) {
      throw new BadRequestException({
        message: '문서 미션을 찾을 수 없습니다.',
      });
    }

    return {
      documentMissionId: documentMission.documentMissionId,
      documentContent: documentMission.documentContent,
      sendAt: documentMission.sendAt,
      userMissionId: documentMission.userMission.userMissionId,
      isSend: documentMission.isSend,
    };
  }

  // 문서 업데이트
  async updateDocumentMission(
    documentMissionId: number,
    Dto: DocumentMissionDto.updateDTO,
  ) {
    const exists = await this.documentMissionRepository.existsBy({
      documentMissionId,
    });

    if (!exists) {
      throw new BadRequestException({
        message: '이메일 미션을 찾을 수 없습니다.',
      });
    }

    const update = await this.documentMissionRepository.update(
      documentMissionId,
      Dto,
    );
    return {
      message: '이메일 업데이트',
      documentMissionId: documentMissionId,
      update: Dto,
    };
  }

  async deleteDocumentMission(documentMissionId: number) {
    const exists = await this.documentMissionRepository.existsBy({
      documentMissionId,
    });

    if (!exists) {
      throw new BadRequestException({
        message: '문서 미션을 찾을 수 없습니다.',
      });
    }

    const deleteDocumentMission =
      this.documentMissionRepository.delete(documentMissionId);
    return {
      message: '이메일 미션 삭제',
      delete: documentMissionId,
    };
  }

  // 유저가 이메일 쓴 거 제출
  async sendDocument(
    documentMissionId: number,
    Dto: DocumentMissionDto.sendDTO,
  ) {
    const documentMission = await this.documentMissionRepository
      .createQueryBuilder('dm')
      .innerJoinAndSelect('dm.userMission', 'um')
      .innerJoinAndSelect('um.mission', 'm')
      .innerJoinAndSelect('m.rubric', 'r')
      .where('dm.documentMissionId = :documentMissionId', { documentMissionId })
      .getOne();
    const sendAt = new Date();

    if (!documentMission) {
      throw new BadRequestException({ message: '문서를 찾을 수 없습니다.' });
    }

    await this.documentMissionRepository.update(documentMissionId, {
      ...Dto,
      sendAt,
      isSend: true,
    });

    const payload = {
      user_answer: documentMission.documentContent,
      question: documentMission.userMission.mission.body,
      rubric: documentMission.userMission.mission.rubric.body,
    };
    const gradingResult =
      await this.internalApi.postToFastApi<RawGradingResult>(
        '/api/v1/document/evaluate',
        payload,
      );

    return await this.userMissionService.saveGradingResult(
      gradingResult,
      documentMission.userMission.userMissionId,
    );
  }

  // 유저가 이메일 쓴 거 저장
  async saveDocument(
    documentMissionId: number,
    Dto: DocumentMissionDto.sendDTO,
  ) {
    const exists = await this.documentMissionRepository.existsBy({
      documentMissionId,
    });
    const saveAt = new Date();

    if (!exists) {
      throw new BadRequestException({ message: '이메일을 찾을 수 없습니다.' });
    }

    await this.documentMissionRepository.update(documentMissionId, {
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
