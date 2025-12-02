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
import { createMissionDto, updateMissionDto } from './dto/mission-dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Post('/create')
  async createMission(@Body() dto: createMissionDto) {
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

  @Patch('/update/:id')
  async updateMission(@Param('id') id: number, @Body() dto: updateMissionDto) {
    return this.missionService.updateMission(Number(id), dto);
  }

  @Delete('/delete/:id')
  async deleteMission(@Param('id') id: number) {
    return this.missionService.deleteMission(Number(id));
  }
}
