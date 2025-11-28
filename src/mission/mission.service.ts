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

  async findAllMission() {
    const allMission = await this.missionRepository.find();

    if (allMission.length === 0) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    return allMission;
  }

  async findByMissionName(missionDTO: MissionDTO.readMission) {
    const { mission_name } = missionDTO;

    const missions = await this.missionRepository.find({
      where: {
        mission_name: Like(`%${mission_name}%`),
      },
    });

    if (missions.length === 0) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    return missions;
  }

  async findByMissionTheme(missionDTO: MissionDTO.readMission) {
    const { mission_theme } = missionDTO;

    const missions = await this.missionRepository.find({
      where: {
        mission_theme: Like(`%${mission_theme}%`),
      },
    });

    if (missions.length === 0) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    return missions;
  }

  async findByMissionId(missionDTO: MissionDTO.readMission) {
    const { mission_id } = missionDTO;

    const mission = await this.missionRepository.findOne({
      where: { mission_id },
    });

    if (!mission) {
      throw new BadRequestException({ message: '미션을 찾을 수 없습니다.' });
    }

    return mission;
  }

  async updateMission(missionDTO: MissionDTO.updateMission) {
    const { mission_id, mission_name, mission_theme, description } = missionDTO;

    const mission = await this.missionRepository.findOne({
      where: { mission_id },
    });

    if (!mission) {
      throw new NotFoundException({ message: '미션을 찾을 수 없습니다.' });
    }

    const update = await this.missionRepository.update(mission_id, missionDTO);

    return { message: '미션 업데이트', update: missionDTO };
  }

  async deleteMission(missionDTO: MissionDTO.deleteMission) {
    const { mission_id } = missionDTO;

    const mission = await this.missionRepository.findOne({
      where: { mission_id },
    });

    if (!mission) {
      throw new NotFoundException({ message: '미션을 찾을 수 없습니다.' });
    }

    const deleteMission = await this.missionRepository.delete(mission_id);

    return { message: '미션 삭제', mission_id: mission_id };
  }
}
