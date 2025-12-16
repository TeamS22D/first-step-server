import { forwardRef, Module } from '@nestjs/common';
import { EmailMissionService } from './email-mission.service';
import { EmailMissionController } from './email-mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailMission } from './entities/email-mission.entity';
import { UserMissionModule } from '../user-mission/user-mission.module';

@Module({
    imports: [
    TypeOrmModule.forFeature([EmailMission]), 
    forwardRef(() => UserMissionModule),
  ],
  exports: [EmailMissionService],
  providers: [EmailMissionService],
  controllers: [EmailMissionController]
})
export class EmailMissionModule {}
