import { Module } from '@nestjs/common';
import { UserMissionService } from './user-mission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMissionController } from './user-mission.controller';
import { UserMission } from '../entities/user-mission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserMission])],
  providers: [UserMissionService],
  controllers: [UserMissionController],
  exports: [UserMissionService],
})
export class UserMissionModule {}
