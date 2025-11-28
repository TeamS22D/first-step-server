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
import { UserMissionService } from './user-mission.service';
import { UserMissionDTO } from 'src/dto/user-mission-dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user-mission')
export class UserMissionController {
  constructor(private readonly userMissionService: UserMissionService) {}

  @Post('/create')
  async createUserMission(
    @Body() userMissionDTO: UserMissionDTO.createUserMission,
  ) {
    return this.userMissionService.createUserMission(userMissionDTO);
  }

  @Get('/:userId')
  async findAllUserMission(@Param('userId') userId: number) {
    return this.userMissionService.findAllUserMission(userId);
  }

  @Get('/:userMissionId')
  async findUserMissionById(@Param('userMissionId') userMissionId: number) {
    return this.userMissionService.findUserMissionById(userMissionId);
  }

  @Get('/:userId/:missionId')
  async findUserMissionByMissionId(
    @Param('userId') userId: number,
    @Param('missionId') missionId: number,
  ) {
    return this.userMissionService.findUserMissionByMissionId(
      userId,
      missionId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/updateUserMission')
  async updateUserMission(
    @Body() userMissionDTO: UserMissionDTO.updateUserMission,
  ) {
    return this.userMissionService.updateUserMission(userMissionDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/deleteUserMission')
  async deleteUserMission(
    @Body() userMissionDTO: UserMissionDTO.deleteUserMission,
  ) {
    return this.userMissionService.deleteUserMission(userMissionDTO);
  }
}
