import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DocumentMissionService } from './document-mission.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/types/user-role.enum';
import { DocumentMissionDto } from './dto/document-mission-dto';

@Controller('document-mission')
export class DocumentMissionController {
  constructor(private documentMissionService: DocumentMissionService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  async createDocumentMission(@Body() Dto: DocumentMissionDto.createDTO) {
    return this.documentMissionService.createDocumentMission(Dto);
  }

  @UseGuards(AuthGuard)
  @Get('/:documentMissionId')
  async findDocumentMission(
    @Param('documentMissionId') documentMissionId: number,
  ) {
    return await this.documentMissionService.findDocumentMission(
      documentMissionId,
    );
  }

  @Patch('/update/:documentMissionId')
  @Roles(Role.ADMIN)
  async updateDocumentMission(
    @Param('emailMissionId') documentMissionId: number,
    @Body() Dto: DocumentMissionDto.updateDTO,
  ) {
    return await this.documentMissionService.updateDocumentMission(
      documentMissionId,
      Dto,
    );
  }

  @Delete('/delete/:documentMissionId')
  @Roles(Role.ADMIN)
  async deleteDocumentMission(
    @Param('documentMissionId') documentMissionId: number,
  ) {
    return this.documentMissionService.deleteDocumentMission(documentMissionId);
  }

  @UseGuards(AuthGuard)
  @Post('send/:documentMissionId')
  @HttpCode(HttpStatus.OK)
  async sendDocument(
    @Param('documentMissionId') documentMissionId: number,
    @Body() Dto: DocumentMissionDto.sendDTO,
  ) {
    return await this.documentMissionService.sendDocument(documentMissionId, Dto);
  }

  @UseGuards(AuthGuard)
  @Patch('save/:documentMissionId')
  async saveDocument(
    @Param('documentMissionId') documentMissionId: number,
    @Body() Dto: DocumentMissionDto.sendDTO,
  ) {
    return await this.documentMissionService.saveDocument(documentMissionId, Dto);
  }
}
