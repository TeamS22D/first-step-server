import { Module } from '@nestjs/common';
import { UserMissionService } from './user-mission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMissionController } from './user-mission.controller';
import { UserMission } from './entities/user-mission.entity';
import { GradingResult } from './entities/grading-result.entity';
import { GradingCriteriaEntity } from './entities/grading-criteria.entity';
import { UserMissionInfoDto } from '../bizwords/dto/user-mission-info.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserMission,
      GradingCriteriaEntity,
      GradingResult,
      UserMissionInfoDto,
    ]),
  ],
  providers: [UserMissionService],
  controllers: [UserMissionController],
  exports: [UserMissionService],
})
export class UserMissionModule {}
