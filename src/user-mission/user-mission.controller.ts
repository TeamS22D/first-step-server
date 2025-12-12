import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserMissionService } from './user-mission.service';
import { UserMissionDTO } from 'src/user-mission/dto/user-mission-dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import type { Request } from 'express';
import { MissionTheme } from '../mission/types/missoin-theme.enum';
import { ProfileGraphDto } from './dto/profile-graph-dto';

@Controller('user-mission')
export class UserMissionController {
  constructor(private readonly userMissionService: UserMissionService) {}

  @Post('/create')
  async createUserMission(
    @Body() userMissionDTO: UserMissionDTO.createUserMission,
  ) {
    return this.userMissionService.createUserMission(userMissionDTO);
  }

  @UseGuards(AuthGuard)
  @Get("/graph")
  async getGrpah(@Req() req, @Query() query: ProfileGraphDto) {
    const userId = req.user['userId'];
    return this.userMissionService.getGraph(userId, query.range);
  }

  @UseGuards(AuthGuard)
  @Get('/missions')
  async findAllMission(
    @Req() req,
    @Query('missionTheme') missionTheme: MissionTheme,
  ) {
    const userId = req.user['userId'];
    if (!missionTheme) {
      return this.userMissionService.findAllUserMission(userId);
    }
    return this.userMissionService.findAllUserMissionByTheme(
      userId,
      missionTheme,
    );
  }

  @Get('/mission/:userMissionId')
  async findUserMissionById(@Param('userMissionId') userMissionId: number) {
    return this.userMissionService.findUserMissionById(userMissionId);
  }

  @UseGuards(AuthGuard)
  @Get('/:userMissionId/result')
  async getMissionResult(@Param('userMissionId') userMissionId: number) {
    return this.userMissionService.findAnswerByUserMissionId(userMissionId);
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteUserMission(@Param('id') id: number) {
    return this.userMissionService.deleteUserMission(Number(id));
  }

  @UseGuards(AuthGuard)
  @Post('/answer/:id')
  async createAnswer(
    @Req() req: Request,
    @Param('id') userMissionId: number,
    @Body() userMissionDto: UserMissionDTO.createAnswer,
  ) {
    const userId = req.user?.['userId'];
    return this.userMissionService.createAnswer(
      userId,
      userMissionId,
      userMissionDto,
    );
  }
}
