import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
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
    async findAllUserMission(@Body() userMissionDTO: UserMissionDTO.readUserMission) {
        return this.userMissionService.findAllUserMission(userMissionDTO);
    }

    @Get('/:user_mission_id')
    async findUserMissionById(@Body() userMissionDTO: UserMissionDTO.readUserMission) {
        return this.userMissionService.findUserMissionById(userMissionDTO);
    }

    @Get('/:user_id/:mission_id')
    async findUserMissionByMissionId(@Body() userMissionDTO: UserMissionDTO.readUserMission) {
        return this.userMissionService.findUserMissionByMissionId(userMissionDTO);
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
