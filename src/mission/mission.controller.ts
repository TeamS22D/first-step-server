import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  @Post('/create')
  async createMission(@Body() dto: MissionDTO.createMission) {
    return this.missionService.createMission(dto);
  }

  @Get('/find-all')
  async findAllMission() {
    return await this.missionService.findAllMission();
  }

  // @Get('/find-by-name')
  // async findByMissionName(@Body() missionDTO: MissionDTO.readMission) {
  //   return await this.missionService.findByMissionName(missionDTO);
  // }
  //
  // @Get('/find-by-theme')
  // async findByMissionTheme(@Body() missionDTO: MissionDTO.readMission) {
  //   return await this.missionService.findByMissionTheme(missionDTO);
  // }

  @Get('/:id')
  async findById(@Param('id') id: number) {
    return this.missionService.findByMissionId(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update/:id')
  async updateMission(
    @Param('id') id: number,
    @Body() missionDTO: MissionDTO.updateMission,
  ) {
    return this.missionService.updateMission(Number(id), missionDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:id')
  async deleteMission(@Param('id') id: number) {
    return this.missionService.deleteMission(Number(id));
  }
}
