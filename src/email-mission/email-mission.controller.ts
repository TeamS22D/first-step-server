import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EmailMissionDTO } from './dto/email-mission-dto';
import { EmailMissionService } from './email-mission.service';

@Controller('email-mission')
export class EmailMissionController {
    constructor(private emailMissionService: EmailMissionService) {}

    @Post('/create')
    async createEmailMission(@Body() Dto: EmailMissionDTO.createDTO) {
        return await this.emailMissionService.createEmailMission(Dto);
    }

    @Get('/:emailMissionId')
    async findEmailMission(@Param() emailMissionId: number) {
        return await this.emailMissionService.findEmailMission(emailMissionId);
    }

    @Patch('/update/:emailMissionId')
    async updateEmailMission(
        @Param() emailMisisonId: number,
        @Body() Dto: EmailMissionDTO.updateDTO) {
            return await this.emailMissionService.updateEmailMission(emailMisisonId, Dto);
        }

    @Delete('/delete/:emailMissionId')
    async deleteEmailMission(@Param() emailMissionId: number) {
        return this.emailMissionService.deleteEmailMission(emailMissionId);
    }
}
