import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailMission } from './entities/email-mission.entity';
import { Repository } from 'typeorm';
import { EmailMissionDTO } from './dto/email-mission-dto';
import { UserMissionService } from '../user-mission/user-mission.service';
import { InternalApiService } from '../internal-api/internal-api.service';
import { RawGradingResult } from '../user-mission/dto/raw-grading-result.dto';

@Injectable()
export class EmailMissionService {
  constructor(
    private readonly userMissionService: UserMissionService,
    private readonly internalApi: InternalApiService,
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
      userMissionId: saved.userMission,
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
    const emailMission = await this.emailMissionRepository
      .createQueryBuilder('em')
      .innerJoinAndSelect('em.userMission', 'um')
      .innerJoinAndSelect('um.mission', 'm')
      .innerJoinAndSelect('m.rubric', 'r')
      .where('em.emailMissionId = :emailMissionId', {
        emailMissionId: emailMissionId,
      })
      .getOne();
    const sendAt = new Date();

    if (!emailMission) {
      throw new BadRequestException({ message: '이메일을 찾을 수 없습니다.' });
    }

    await this.emailMissionRepository.update(emailMissionId, {
      ...Dto,
      sendAt,
      isSend: true,
    });

    const gradingResult = {
      evaluations: [
        {
          item: '구조·논리성',
          score: 85,
          feedback: {
            good_points:
              '문서의 목차가 명확하고 구조적 순서가 논리적입니다. 내용 전개의 흐름이 일관됩니다.',
            improvement_points:
              '파일명 규칙이 누락되어 있습니다. 시각적 서식에서 구분선 사용이 불충분합니다.',
            suggested_fix:
              "파일명을 '[연구보고서]고객서비스개선_20251123_v1.0' 형태로 적용하고, 각 섹션을 구분하기 위해 구분선을 사용할 수 있습니다.",
          },
        },
        {
          item: '목적 적합성',
          score: 82,
          feedback: {
            good_points:
              '보고서의 목적이 서론과 요약에서 명확하게 제시되었습니다. 주요 내용과 결과가 일치합니다.',
            improvement_points:
              '핵심요약에서 보다 구체적인 숫자나 구체적 결과가 추가되면 좋겠습니다.',
            suggested_fix:
              '요약에 주요 수치나 지표를 포함시켜 비즈니스 임팩트를 더욱 명확하게 전달할 수 있습니다.',
          },
        },
        {
          item: '내용 완성도',
          score: 75,
          feedback: {
            good_points:
              '주요 수치와 지표가 잘 제시되어 있습니다. 문제점과 해결책이 구체적입니다.',
            improvement_points:
              '근거 자료의 구체적인 제시가 부족합니다. 시뮬레이션 및 통계 분석 부분에서 자료를 추가할 수 있습니다.',
            suggested_fix:
              '분석에 사용된 구체적인 데이터 표나 시뮬레이션 결과를 추가로 포함하여 신뢰성을 높일 수 있습니다.',
          },
        },
        {
          item: '실행 가능성',
          score: 70,
          feedback: {
            good_points:
              '단계적 도입 전략이 현실적이고 타당합니다. KPI 설정으로 목표가 명확합니다.',
            improvement_points:
              '리스크 및 한계점에 대한 언급이 부족합니다. 자원이나 예산 계획이 제시되지 않았습니다.',
            suggested_fix:
              '세부적인 리스크 관리 계획 및 예산 안배를 명시하여 계획의 실행 가능성을 높일 수 있습니다.',
          },
        },
        {
          item: '전문성·톤앤매너',
          score: 8,
          feedback: {
            good_points:
              '전체적으로 전문적인 어조와 맞춤법 정확성을 유지했습니다.',
            improvement_points: '부서를 중심으로 한 조직적 표현이 부족합니다.',
            suggested_fix:
              "서론이나 결론에 부서를 중심으로 한 명시적인 표현(예: 'AI 연구팀은')을 추가할 수 있습니다.",
          },
        },
      ],
      total_score: 66,
      grade: 'B',
      general_feedback:
        '보고서는 구조적이고 논리적인 전개를 유지하고 있으며 목차가 잘 구성되어 있습니다. 각 섹션의 주제는 명확하게 전달되고 있으며, 수치와 지표를 활용하여 내용을 강화하는 점이 긍정적입니다. 그러나 파일명 규칙이 없고, 구체적인 근거 자료의 보강이 필요합니다. 향후 리스크나 한계점을 더 명시적으로 언급하고, 예산 및 자원 계획을 포함함으로써 계획의 실행 가능성을 높일 수 있습니다. 전반적으로 잘 구성된 문서지만, 세부적인 보완을 통해 더 높은 수준의 전문성을 갖출 수 있을 것입니다.',
    };

    return await this.userMissionService.saveGradingResult(
      gradingResult,
      emailMission.userMission.userMissionId,
    );
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
