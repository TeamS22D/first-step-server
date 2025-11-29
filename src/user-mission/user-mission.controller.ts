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

  @Get('/user/:userId')
  async findAllUserMission(@Param('userId') userId: number) {
    return this.userMissionService.findAllUserMission(Number(userId));
  }

  @Get('/mission/:userMissionId')
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
  @Patch('/:id')
  async updateUserMission(
    @Param('id') id: number,
    @Body() userMissionDTO: UserMissionDTO.updateUserMission,
  ) {
    return this.userMissionService.updateUserMission(
      Number(id),
      userMissionDTO,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteUserMission(@Param('id') id: number) {
    return this.userMissionService.deleteUserMission(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/answer/:id')
  async createAnswer(
    @Param('id') id: number,
    @Body() userMissionDto: UserMissionDTO.createAnswer,
  ) {
    return this.userMissionService.createAnswer(id, userMissionDto);
  }
}
