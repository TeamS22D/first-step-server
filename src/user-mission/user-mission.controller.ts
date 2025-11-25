import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Patch, 
    Post, 
    UseGuards 
} from '@nestjs/common';
import { UserMissionService } from './user-mission.service';
import { UserMissionDTO } from 'src/auth/dto/userMission-dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user-mission')
export class UserMissionController {
    constructor(private readonly userMissionService: UserMissionService) {}

    @Post('/createUserMission')
    async createUserMission(@Body() userMissionDTO: UserMissionDTO.createUserMission) {
        console.log('raw body:', userMissionDTO);
        return this.userMissionService.createUserMission(userMissionDTO);
    }

    @Get('/:user_id')
    async findAllUserMission(@Param('user_id') user_id: number) {
        return this.userMissionService.findAllUserMission(user_id);
    }

    @Get('/:user_mission_id')
    async findUserMissionById(@Param('user_mission_id') user_mission_id: number) {
        return this.userMissionService.findUserMissionById(user_mission_id);
    }

    @Get('/:user_id/:mission_id')
    async findUserMissionByMissionId(@Param('user_id') user_id: number, @Param('mission_id') mission_id: number) {
        return this.userMissionService.findUserMissionByMissionId(user_id, mission_id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('/updateUserMission')
    async updateUserMission(@Body() userMissionDTO: UserMissionDTO.updateUserMission) {
        return this.userMissionService.updateUserMission(userMissionDTO);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/deleteUserMission')
    async deleteUserMission(@Body() userMissionDTO: UserMissionDTO.deleteUserMission) {
        return this.userMissionService.deleteUserMission(userMissionDTO);
    }

}
