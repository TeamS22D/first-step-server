import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Patch, 
    Post, 
    UseGuards 
} from '@nestjs/common';

import { MissionService } from './mission.service';
import { AuthGuard } from '@nestjs/passport';
import { MissionDTO } from 'src/auth/dto/mission-dto';

@Controller('mission')
export class MissionController {
    constructor(private readonly missionService: MissionService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('/createMission')
    async createMission(@Body() missionDTO: MissionDTO.createMission) {
        return this.missionService.createMission(missionDTO);
    }

    @Get('/findAllMission')
    async findAllMission() {
        return await this.missionService.findAllMission();
    }

    @Get('/findByMissionName')
    async findByMissionName(@Body() missionDTO: MissionDTO.readMission) {
        return await this.missionService.findByMissionName(missionDTO);
    }

    @Get('/findByMissionTheme')
    async findByMissionTheme(@Body() missionDTO: MissionDTO.readMission) {
        return await this.missionService.findByMissionTheme(missionDTO);
    }

    @Get('/findByMissionId')
    async findByMissionId(@Body() missionDTO: MissionDTO.readMission) {
        return await this.missionService.findByMissionId(missionDTO);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('/updateMission')
    async updateMission(@Body() missionDTO: MissionDTO.updateMission) {
        return this.missionService.updateMission(missionDTO);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/deleteMission')
    async deleteMission(@Body() missionDTO: MissionDTO.deleteMission) {
        return this.missionService.deleteMission(missionDTO);
    }
}
