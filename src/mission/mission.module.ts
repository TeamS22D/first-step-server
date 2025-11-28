import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { Mission } from '../entities/mission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Mission])],
  providers: [MissionService],
  controllers: [MissionController],
  exports: [MissionService],
})
export class MissionModule {}
