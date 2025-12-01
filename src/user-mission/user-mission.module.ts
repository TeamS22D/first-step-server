import { forwardRef, Module } from '@nestjs/common';
import { UserMissionService } from './user-mission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMissionController } from './user-mission.controller';
import { UserMission } from './entities/user-mission.entity';
import { GradingResult } from './entities/grading-result.entity';
import { GradingCriteria } from './entities/grading-criteria';
import { EmailMissionModule } from 'src/email-mission/email-mission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserMission, GradingCriteria, GradingResult]),
        forwardRef(() => EmailMissionModule),
  ],
  providers: [UserMissionService],
  controllers: [UserMissionController],
  exports: [UserMissionService],
})
export class UserMissionModule {}
