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

  async createUserMission(userMissionDTO: UserMissionDTO.createUserMission) {
    const { userId, missionId } = userMissionDTO;

    const start_date = new Date();
    const end_date = new Date(start_date);
    end_date.setDate(end_date.getDate() + 7);

    const entity = this.userMissionRepository.create({
      user_id: user_id,
      mission_id: mission_id,
      start_date: start_date,
      end_date: end_date,
    });

    const saved = await this.userMissionRepository.save(entity);

    return saved;
  }

  async findAllUserMission(user_id: number) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const count = await this.userMissionRepository.countBy({
      user_id: user_id,
    });

    const missions = await this.userMissionRepository.find({
      where: { user_id, end_date: MoreThan(now) },
    });

    if (!missions || missions.length === 0) {
      throw new BadRequestException({ message: '미션이 존재하지 않습니다.' });
    }

    return { count, missions };
  }

  async findUserMissionById(user_mission_id: number) {
    const userMission = await this.userMissionRepository.findOne({
      where: { user_mission_id },
    });

    if (!userMission) {
      throw new BadRequestException({ message: '미션이 없습니다.' });
    }

    return userMission;
  }

  async findUserMissionByMissionId(user_id: number, mission_id: number) {
    const userMission = await this.userMissionRepository.findOne({
      where: { user_id, mission_id },
    });

    if (!userMission) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    return userMission;
  }

  async updateUserMission(userMissionDTO: UserMissionDTO.updateUserMission) {
    const { user_mission_id } = userMissionDTO;

    const userMission = await this.userMissionRepository.findOne({
      where: { user_mission_id },
    });

    if (!userMission) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    const update = await this.userMissionRepository.update(
      user_mission_id,
      userMissionDTO,
    );

    return { message: '유저미션 업데이트', update: userMissionDTO };
  }

  async deleteUserMission(userMissionDTO: UserMissionDTO.deleteUserMission) {
    const { user_mission_id } = userMissionDTO;

    const userMission = await this.userMissionRepository.findOne({
      where: { user_mission_id },
    });

    if (!userMission) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    const deleteUserMission =
      await this.userMissionRepository.delete(user_mission_id);

    return { message: '유저미션 삭제', delete: userMissionDTO };
  }
}
