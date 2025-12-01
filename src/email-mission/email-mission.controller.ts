import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { EmailMissionDTO } from './dto/email-mission-dto';
import { EmailMissionService } from './email-mission.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/types/user-role.enum';

@Controller('email-mission')
export class EmailMissionController {
    constructor(private emailMissionService: EmailMissionService) {}

    @UseGuards(AuthGuard)
    @Post('/create')
    async createEmailMission(@Body() Dto: EmailMissionDTO.createDTO) {
        return await this.emailMissionService.createEmailMission(Dto);
    }

    @UseGuards(AuthGuard)
    @Get('/:emailMissionId')
    async findEmailMission(
        @Param() emailMissionId: number
    ) {
        return await this.emailMissionService.findEmailMission(emailMissionId);
    }

    @Patch('/update/:emailMissionId')
    @Roles(Role.ADMIN)
    async updateEmailMission(
        @Param() emailMisisonId: number,
        @Body() Dto: EmailMissionDTO.updateDTO
    ) {
            return await this.emailMissionService.updateEmailMission(emailMisisonId, Dto);
    }

    @Delete('/delete/:emailMissionId')
    @Roles(Role.ADMIN)
    async deleteEmailMission(@Param() emailMissionId: number) {
        return this.emailMissionService.deleteEmailMission(emailMissionId);
    }

    @UseGuards(AuthGuard)
    @Patch('send/:emailMissionId')
    async sendEmail(
        @Param() emailMissionId: number,
        @Body() Dto: EmailMissionDTO.sendDTO
    ) {
        return await this.emailMissionService.sendEmail(emailMissionId, Dto);
    }

    @UseGuards(AuthGuard)
    @Patch('save/:emailMissionId')
    async saveEmail(
        @Param() emailMissionId: number,
        @Body() Dto: EmailMissionDTO.sendDTO
        ) {
            return await this.emailMissionService.saveEmail(emailMissionId, Dto);
        }
}
