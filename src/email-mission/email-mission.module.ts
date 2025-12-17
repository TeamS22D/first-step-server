import { forwardRef, Module } from '@nestjs/common';
import { EmailMissionService } from './email-mission.service';
import { EmailMissionController } from './email-mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailMission } from './entities/email-mission.entity';
import { UserMission } from 'src/user-mission/entities/user-mission.entity';
import { UserMissionModule } from 'src/user-mission/user-mission.module';
import { InternalApiModule } from '../internal-api/internal-api.module';

@Module({
    imports: [
    TypeOrmModule.forFeature([EmailMission]), 
    forwardRef(() => UserMissionModule),
    InternalApiModule,
    UserMissionModule,
    ],
  exports: [EmailMissionService],
  providers: [EmailMissionService],
  controllers: [EmailMissionController]
})
export class EmailMissionModule {}
