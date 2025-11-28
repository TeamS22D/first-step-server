import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UserMissionDTO } from 'src/dto/user-mission-dto';
import { UserMission } from '../entities/user-mission.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class UserMissionService {
  constructor(
    @InjectRepository(UserMission)
    private userMissionRepository: Repository<UserMission>,
  ) {}

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

  async findAllUserMission(userId: number) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const count = await this.userMissionRepository.count({
      where: { user: { userId } },
    });

    const missions = await this.userMissionRepository.find({
      where: {
        user: { userId },
        endDate: MoreThan(now),
      },
    });

    if (!missions || missions.length === 0) {
      throw new BadRequestException({ message: '미션이 존재하지 않습니다.' });
    }

    return { count, missions };
  }

  async findUserMissionById(userMissionId: number) {
    const userMission = await this.userMissionRepository.findOne({
      where: { userMissionId },
    });

    if (!userMission) {
      throw new BadRequestException({ message: '미션이 없습니다.' });
    }

    return userMission;
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

  async updateUserMission(dto: UserMissionDTO.updateUserMission) {
    const { userMissionId } = dto;

    const userMission = await this.userMissionRepository.findOne({
      where: { userMissionId },
    });

    if (!userMission) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    await this.userMissionRepository.update(userMissionId, dto);

    return { message: '유저 미션 업데이트 완료', update: dto };
  }

  async deleteUserMission(dto: UserMissionDTO.deleteUserMission) {
    const { userMissionId } = dto;

    const userMission = await this.userMissionRepository.findOne({
      where: { userMissionId },
    });

    if (!userMission) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    await this.userMissionRepository.delete(userMissionId);

    return { message: '유저 미션 삭제 완료', delete: dto };
  }
}
