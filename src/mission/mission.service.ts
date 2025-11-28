import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { MissionDTO } from 'src/dto/mission-dto';
import { Mission } from '../entities/mission.entity';
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

  //TODO: 페이지네이션 구현
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

  async findByMissionId(missionDTO: MissionDTO.readMission) {
    const { missionId } = missionDTO;

    const mission = await this.missionRepository.findOne({
      where: { missionId },
    });

    if (!mission) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    return mission;
  }

  async updateMission(missionDTO: MissionDTO.updateMission) {
    const { missionId } = missionDTO;
    const exists = await this.missionRepository.existsBy({ missionId });

    if (!exists) {
      throw new NotFoundException({ message: '미션을 찾을 수 없습니다.' });
    }
    await this.missionRepository.update(missionId, missionDTO);
    return { message: '미션 업데이트', update: missionDTO };
  }

  async deleteMission(missionDTO: MissionDTO.deleteMission) {
    const { missionId } = missionDTO;
    const exists = await this.missionRepository.existsBy({ missionId });

    if (!exists) {
      throw new NotFoundException({ message: '미션을 찾을 수 없습니다.' });
    }
    await this.missionRepository.delete(missionId);
    return { message: '미션 삭제', missionId: missionId };
  }
}
