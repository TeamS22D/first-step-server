import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
        return this.emailMissionService.createEmailMission(Dto);
    }

    @UseGuards(AuthGuard)
    @Get('/:emailMissionId')
    async findEmailMission(
        @Param('emailMissionId') emailMissionId: number
    ) {
        return await this.emailMissionService.findEmailMission(emailMissionId);
    }

    @Patch('/update/:emailMissionId')
    @Roles(Role.ADMIN)
    async updateEmailMission(
        @Param('emailMissionId') emailMisisonId: number,
        @Body() Dto: EmailMissionDTO.updateDTO
    ) {
            return await this.emailMissionService.updateEmailMission(emailMisisonId, Dto);
    }

    @Delete('/delete/:emailMissionId')
    @Roles(Role.ADMIN)
    async deleteEmailMission(@Param('emailMissionId') emailMissionId: number) {
        return this.emailMissionService.deleteEmailMission(emailMissionId);
    }

    @UseGuards(AuthGuard)
    @Post('send/:emailMissionId')
    @HttpCode(HttpStatus.OK)
    async sendEmail(
        @Param('emailMissionId') emailMissionId: number,
        @Body() Dto: EmailMissionDTO.sendDTO) {
        return await this.emailMissionService.sendEmail(emailMissionId, Dto);
    }

    @UseGuards(AuthGuard)
    @Patch('save/:emailMissionId')
    async saveEmail(
        @Param('emailMissionId') emailMissionId: number,
        @Body() Dto: EmailMissionDTO.sendDTO
        ) {
            return await this.emailMissionService.saveEmail(emailMissionId, Dto);
        }
}
