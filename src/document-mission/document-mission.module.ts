import { forwardRef, Module } from '@nestjs/common';
import { DocumentMissionService } from './document-mission.service';
import { DocumentMissionController } from './document-mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMissionModule } from 'src/user-mission/user-mission.module';
import { DocumentMission } from './entities/document-mission.entity';
import { InternalApiModule } from '../internal-api/internal-api.module';
import { UserMission } from '../user-mission/entities/user-mission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentMission]),
    forwardRef(() => UserMissionModule),
    InternalApiModule,
    UserMissionModule,
  ],
  exports: [DocumentMissionService],
  providers: [DocumentMissionService],
  controllers: [DocumentMissionController],
})
export class DocumentMissionModule {}
