import { 
    Body, 
    Controller, 
    Delete, 
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

    @Post('/findAllUserMission')
    async findAllUserMission(@Body() userMissionDTO: UserMissionDTO.readUserMission) {
        return this.userMissionService.findAllUserMission(userMissionDTO);
    }

    @Post('/findUserMissionById')
    async findUserMissionById(@Body() usermissionDTO: UserMissionDTO.readUserMission) {
        return this.userMissionService.findUserMissionById(usermissionDTO);
    }

    @Post('/findUserMissionByMissionId')
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
