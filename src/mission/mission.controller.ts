import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { MissionService } from './mission.service';
import { AuthGuard } from '@nestjs/passport';
import { MissionDTO } from 'src/dto/mission-dto';

@Controller('mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/create-mission')
  async createMission(@Body() dto: MissionDTO.createMission) {
    return this.missionService.createMission(dto);
  }

  @Get('/find-all-mission')
  async findAllMission() {
    return await this.missionService.findAllMission();
  }

  @Get('/find-by-mission-name')
  async findByMissionName(@Body() missionDTO: MissionDTO.readMission) {
    return await this.missionService.findByMissionName(missionDTO);
  }

  @Get('/find-by-mission-theme')
  async findByMissionTheme(@Body() missionDTO: MissionDTO.readMission) {
    return await this.missionService.findByMissionTheme(missionDTO);
  }

  @Get('/find-by-mission-id')
  async findByMissionId(@Body() missionDTO: MissionDTO.readMission) {
    return await this.missionService.findByMissionId(missionDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update-mission')
  async updateMission(@Body() missionDTO: MissionDTO.updateMission) {
    return this.missionService.updateMission(missionDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete-mission')
  async deleteMission(@Body() missionDTO: MissionDTO.deleteMission) {
    return this.missionService.deleteMission(missionDTO);
  }
}
