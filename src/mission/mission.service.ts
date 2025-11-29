import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { MissionDTO } from 'src/mission/dto/mission-dto';
import { Mission } from './entities/mission.entity';
import { Like, Repository } from 'typeorm';
import { RubricService } from '../rubric/rubric.service';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
    private readonly rubricService: RubricService,
  ) {}

  async createMission(missionDto: MissionDTO.createMission) {
    const { rubricId, ...rest } = missionDto;
    const rubric = await this.rubricService.getRubricById(rubricId);

    const mission = this.missionRepository.create({
      ...rest,
      rubric: rubric,
    });
    return await this.missionRepository.save(mission);
  }

  async findAllMission() {
    return await this.missionRepository.find();
  }

  async findByMissionName(missionDTO: MissionDTO.readMission) {
    const { missionName } = missionDTO;

    const missions = await this.missionRepository.find({
      where: {
        missionName: Like(`%${missionName}%`),
      },
    });

    if (missions.length === 0) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    return missions;
  }

  async findByMissionTheme(missionDTO: MissionDTO.readMission) {
    const { missionTheme } = missionDTO;

    const missions = await this.missionRepository.find({
      where: {
        missionTheme: Like(`%${missionTheme}%`),
      },
    });

    if (missions.length === 0) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    return missions;
  }

  async findByMissionId(missionId: number) {
    const mission = await this.missionRepository.findOne({
      where: { missionId },
    });
    if (!mission) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    return mission;
  }

  async updateMission(missionId: number, missionDTO: MissionDTO.updateMission) {
    const { rubricId, ...rest } = missionDTO;
    const exists = await this.missionRepository.existsBy({ missionId });
    const rubric = await this.rubricService.getRubricById(rubricId);
    const updateData = {
      ...rest,
      rubric: rubric,
    };

    if (!exists) {
      throw new NotFoundException({ message: '미션을 찾을 수 없습니다.' });
    }
    await this.missionRepository.update(missionId, updateData);
    return { message: '미션 업데이트', update: updateData };
  }

  async deleteMission(missionId: number) {
    const exists = await this.missionRepository.existsBy({ missionId });

    if (!exists) {
      throw new NotFoundException({ message: '미션을 찾을 수 없습니다.' });
    }
    await this.missionRepository.delete(missionId);
    return { message: '미션 삭제', missionId: missionId };
  }
}
