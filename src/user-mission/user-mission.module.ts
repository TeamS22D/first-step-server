import { Module } from '@nestjs/common';
import { UserMissionService } from './user-mission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMissionEntity } from '../entities/userMission.entity';
import { UserMissionController } from './user-mission.controller';

@Module({
      imports: [
      TypeOrmModule.forFeature([UserMissionEntity]),
    ],
  providers: [UserMissionService],
  controllers: [UserMissionController],
  exports: [UserMissionService]
})
export class UserMissionModule {}
