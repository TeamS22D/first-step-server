import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentMission } from './entities/document-mission.entity';
import { Repository } from 'typeorm';
import { DocumentMissionDto } from './dto/document-mission-dto';

@Injectable()
export class DocumentMissionService {
  constructor(
    @InjectRepository(DocumentMission)
    private documentMissionRepository: Repository<DocumentMission>,
  ) {}

  // 이거 유저가 처음 미션 들어오자 마자 실행
  async createDocumentMission(Dto: DocumentMissionDto.createDTO) {
    const documentMission = this.documentMissionRepository.create(Dto);
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
    });

    if (!documentMission) {
      throw new BadRequestException({
        message: '문서 미션을 찾을 수 없습니다.',
      });
    }

    return documentMission;
  }

  // 이메일 업데이트
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
  async sendDocument(documentMissionId: number, Dto: DocumentMissionDto.sendDTO) {
    const exists = await this.documentMissionRepository.existsBy({
      documentMissionId,
    });
    const sendAt = new Date();

    if (!exists) {
      throw new BadRequestException({ message: '문서를 찾을 수 없습니다.' });
    }

    await this.documentMissionRepository.update(documentMissionId, {
      ...Dto,
      sendAt,
      isSend: true,
    });

    const result = {
      ...Dto,
      sendAt,
    };

    return {
      message: '문서가 제출되었습니다.',
      send: result,
    };
  }

  // 유저가 이메일 쓴 거 저장
  async saveDocument(documentMissionId: number, Dto: DocumentMissionDto.sendDTO) {
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
