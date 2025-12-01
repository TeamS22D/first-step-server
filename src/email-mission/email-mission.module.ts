import { Module } from '@nestjs/common';
import { EmailMissionService } from './email-mission.service';
import { EmailMissionController } from './email-mission.controller';

@Module({
  exports: [EmailMissionService],
  providers: [EmailMissionService],
  controllers: [EmailMissionController]
})
export class EmailMissionModule {}
