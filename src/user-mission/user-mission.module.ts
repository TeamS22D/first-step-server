import { Module } from '@nestjs/common';
import { UserMissionService } from './user-mission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMissionController } from './user-mission.controller';
import { UserMission } from '../entities/user-mission.entity';
import { GradingResult } from '../entities/grading-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserMission, GradingResult])],
  providers: [UserMissionService],
  controllers: [UserMissionController],
  exports: [UserMissionService],
})
export class UserMissionModule {}
