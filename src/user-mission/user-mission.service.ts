import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UserMissionDTO } from '../user-mission/dto/user-mission-dto';
import { UserMission } from './entities/user-mission.entity';
import { MoreThan, Repository } from 'typeorm';
import { GradingCriteriaEntity } from './entities/grading-criteria.entity';
import { GradingResult } from './entities/grading-result.entity';
import { MissionTheme } from '../mission/types/missoin-theme.enum';
import { GraphRange } from './enums/graph-range.enum';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { UserMissionInfoDto } from './dto/user-mission-info.dto';
import { MissionInfoDto } from './dto/mission-info.dto';

dayjs.extend(isoWeek);

@Injectable()
export class UserMissionService {
  constructor(
    @InjectRepository(UserMission)
    private userMissionRepository: Repository<UserMission>,
    @InjectRepository(GradingCriteriaEntity)
    private criteriaRepository: Repository<GradingCriteriaEntity>,
    @InjectRepository(GradingResult)
    private resultRepository: Repository<GradingResult>,
  ) {}

  async getUserMissionInfo(userId: number) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const defaultInfo = () => new MissionInfoDto(0, 0);
    const total = await this.userMissionRepository.count({
      where: {
        user: { userId },
        endDate: MoreThan(now),
      },
    });
    const completed = await this.userMissionRepository.count({
      where: {
        user: { userId },
        endDate: MoreThan(now),
        completed: true,
      },
    });
    const raw = await this.userMissionRepository
      .createQueryBuilder('um')
      .innerJoin('um.mission', 'm')
      .where('um.user = :user_id', { user_id: userId })
      .andWhere('um.endDate > :now', { now })
      .select('m.missionTheme', 'theme')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        'SUM(CASE WHEN um.completed = true THEN 1 ELSE 0 END)',
        'completed',
      )
      .groupBy('m.missionTheme')
      .getRawMany();

    const map: Record<string, MissionInfoDto> = {
      mission: new MissionInfoDto(completed, total),
      document: defaultInfo(),
      email: defaultInfo(),
      chat: defaultInfo(),
    };
    for (const row of raw) {
      const total = Number(row.total);
      const completed = Number(row.completed);

      map[row.theme] = new MissionInfoDto(completed, total);
    }

    return new UserMissionInfoDto(
      map.mission,
      map.document,
      map.email,
      map.chat,
    );
  }

  async createUserMission(dto: UserMissionDTO.createUserMission) {
    const { userId, missionId } = dto;

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const entity = this.userMissionRepository.create({
      user: { userId },
      mission: { missionId },
      startDate,
      endDate,
    });

    return await this.userMissionRepository.save(entity);
  }

  async getGraph(userId: number, range: GraphRange) {
    const now = new Date();

    const getDateRange = (range: GraphRange) => {
      switch (range) {
        case GraphRange.WEEK:
          return [
            new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            new Date(now.getTime() + 24 * 60 * 60 * 1000),
          ];

        case GraphRange.MONTH:
          return [
            new Date(now.getFullYear(), now.getMonth(), 1),
            new Date(now.getFullYear(), now.getMonth() + 1, 1),
          ];

        case GraphRange.YEAR:
          return [
            new Date(now.getFullYear(), 0, 1),
            new Date(now.getFullYear() + 1, 0, 1),
          ];

        default:
          return [null, null];
      }
    };

    const [start, end] = getDateRange(range);

    /** -----------------------------------------------------
     * ① 날짜를 YYYY-MM-DD로 강제 포맷 (중요!)
     * ----------------------------------------------------- */
    const raw = await this.resultRepository
      .createQueryBuilder('r')
      .innerJoin('r.mission', 'm')
      .select('m.missionTheme', 'theme')
      .addSelect(`DATE_FORMAT(r.createdAt, '%Y-%m-%d')`, 'date')
      .addSelect('AVG(r.total_score)', 'avgScore')
      .where('r.userId = :userId', { userId })
      .andWhere('r.createdAt >= :start', { start })
      .andWhere('r.createdAt < :end', { end })
      .groupBy('theme, DATE_FORMAT(r.createdAt, "%Y-%m-%d")')
      .orderBy('date')
      .getRawMany();

    /** -----------------------------------------------------
     * ② historyMap 생성
     * ----------------------------------------------------- */
    const historyMap: any = {};

    raw.forEach(({ date, avgScore, theme }) => {
      if (!historyMap[date]) {
        historyMap[date] = {
          index: date, // 날짜가 항상 YYYY-MM-DD
          document: 0,
          chat: 0,
          mail: 0,
        };
      }
      historyMap[date][theme.toLowerCase()] = Number(avgScore) ?? 0;
    });

    /** -----------------------------------------------------
     * YEAR → 12개월 강제 생성
     * ----------------------------------------------------- */
    if (range === GraphRange.YEAR) {
      const year = now.getFullYear();
      const filled: any[] = [];

      // 날짜 "YYYY-MM"로 축소
      const normalized = Object.values(historyMap).map((h: any) => {
        const [y, m] = h.index.split('-');
        const ym = `${y}-${m}`;

        return {
          index: ym,
          document: h.document,
          chat: h.chat,
          mail: h.mail,
        };
      });

      for (let month = 0; month < 12; month++) {
        const key = `${year}-${String(month + 1).padStart(2, '0')}`;

        const matches = normalized.filter((h) => h.index === key);

        if (matches.length > 0) {
          const combined = {
            index: key,
            document:
              matches.reduce((a, b) => a + (b.document ?? 0), 0) /
              matches.length,
            chat:
              matches.reduce((a, b) => a + (b.chat ?? 0), 0) / matches.length,
            mail:
              matches.reduce((a, b) => a + (b.mail ?? 0), 0) / matches.length,
          };
          filled.push(combined);
        } else {
          filled.push({
            index: key,
            document: 0,
            chat: 0,
            mail: 0,
          });
        }
      }

      return {
        range: 'year',
        history: filled,
      };
    }

    return {
      range: range.toLowerCase(),
      history: Object.values(historyMap),
    };
  }

  async findAllUserMission(userId: number) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const origin = await this.userMissionRepository.find({
      where: {
        user: { userId },
        endDate: MoreThan(now),
      },
      relations: ['mission'],
    });

    if (!origin || origin.length === 0) {
      throw new BadRequestException({ message: '미션이 존재하지 않습니다.' });
    }

    const missions = origin.map((um) => ({
      userMissionId: um.userMissionId,
      missionId: um.mission.missionId,
      missionName: um.mission.missionName,
      missionTheme: um.mission.missionTheme,
      startDate: um.startDate,
      endDate: um.endDate,
    }));
    return missions;
  }

  async findAllUserMissionByTheme(userId: number, theme: MissionTheme) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const origin = await this.userMissionRepository.find({
      where: {
        user: { userId },
        endDate: MoreThan(now),
        mission: { missionTheme: theme },
      },
      relations: ['mission'],
    });

    if (!origin || origin.length === 0) {
      throw new BadRequestException({ message: '미션이 존재하지 않습니다.' });
    }

    const missions = origin.map((um) => ({
      userMissionId: um.userMissionId,
      missionId: um.mission.missionId,
      missionName: um.mission.missionName,
      missionTheme: um.mission.missionTheme,
      startDate: um.startDate,
      endDate: um.endDate,
    }));
    return missions;
  }

  async findAllCompletedUserMission(userId: number) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const origin = await this.userMissionRepository.find({
      where: {
        user: { userId },
        completed: true,
        endDate: MoreThan(now),
      },
      relations: ['mission'],
    });

    if (!origin || origin.length === 0) {
      throw new BadRequestException({ message: '미션이 존재하지 않습니다.' });
    }

    const missions = origin.map((um) => ({
      userMissionId: um.userMissionId,
      missionId: um.mission.missionId,
      missionName: um.mission.missionName,
      missionTheme: um.mission.missionTheme,
      startDate: um.startDate,
      endDate: um.endDate,
    }));
    return missions;
  }

  async findAllCompletedUserMissionByTheme(
    userId: number,
    theme: MissionTheme,
  ) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const origin = await this.userMissionRepository.find({
      where: {
        user: { userId },
        completed: true,
        endDate: MoreThan(now),
        mission: { missionTheme: theme },
      },
      relations: ['mission'],
    });

    if (!origin || origin.length === 0) {
      throw new BadRequestException({ message: '미션이 존재하지 않습니다.' });
    }

    const missions = origin.map((um) => ({
      userMissionId: um.userMissionId,
      missionId: um.mission.missionId,
      missionName: um.mission.missionName,
      missionTheme: um.mission.missionTheme,
      startDate: um.startDate,
      endDate: um.endDate,
    }));
    return missions;
  }

  async findAnswerByUserMissionId(userMissionId: number) {
    return await this.resultRepository.findOne({
      where: { userMission: { userMissionId } },
      relations: ['gradingCriterias'],
    });
  }

  async findUserMissionById(userMissionId: number) {
    return await this.userMissionRepository.findOne({
      where: { userMissionId },
    });
  }

  async findUserMissionByMissionId(userId: number, missionId: number) {
    const userMission = await this.userMissionRepository.findOne({
      where: {
        user: { userId },
        mission: { missionId },
      },
    });

    if (!userMission) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    return userMission;
  }

  async updateUserMission(
    userMissionId: number,
    dto: UserMissionDTO.updateUserMission,
  ) {
    const userMission = await this.userMissionRepository.findOne({
      where: { userMissionId },
    });
    if (!userMission) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    await this.userMissionRepository.update(userMissionId, dto);
    return { message: '유저 미션 업데이트 완료', update: dto };
  }

  async deleteUserMission(userMissionId: number) {
    const userMission = await this.userMissionRepository.findOne({
      where: { userMissionId },
    });

    if (!userMission) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    await this.userMissionRepository.delete(userMissionId);

    return { message: '유저 미션 삭제 완료' };
  }
  //TODO: 트랜젝션 설정
  async createAnswer(
    userId: number,
    userMissionId: number,
    dto: UserMissionDTO.createAnswer,
  ) {
    const userMission = await this.userMissionRepository.findOne({
      where: { userMissionId },
      relations: ['mission', 'user'],
    });
    if (!userMission) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }
    if (userMission.user.userId !== userId) {
      throw new ForbiddenException({ message: '접근할 수 없습니다.' });
    }
    if (userMission.gradingResult) {
      throw new BadRequestException({
        message: '이미 결과가 나온 미션입니다.',
      });
    }
    await this.userMissionRepository.update(userMissionId, dto);
    // 평가 시스템 예시
    const gradingResult = this.resultRepository.create({
      totalScore: 100,
      grade: 'A',
      summeryFeedback: '너무 멋져요',
      internalNote: 'a',
      mission: { missionId: userMission.mission.missionId },
      userId: userMission.user.userId,
      userMission,
    });
    await this.resultRepository.save(gradingResult);
    for (let i = 0; i < 5; i++) {
      const gradingCriteria = this.criteriaRepository.create({
        index: i + 1,
        item: `${i + 1}d`,
        score: 100,
        maxScore: 100,
        gradingResult,
        feedback: {
          goodPoints: '1',
          improvementPoints: '2',
          suggestedFix: '3',
        },
      });
      await this.criteriaRepository.save(gradingCriteria);
    }
    return await this.resultRepository.findOne({
      where: { id: gradingResult.id },
      relations: ['gradingCriterias'],
    });
  }
}
