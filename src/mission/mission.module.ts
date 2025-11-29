import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { Mission } from '../entities/mission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RubricModule } from '../rubric/rubric.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mission]), RubricModule],
  providers: [MissionService],
  controllers: [MissionController],
  exports: [MissionService],
})
export class MissionModule {}
