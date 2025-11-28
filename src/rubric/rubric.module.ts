import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rubric } from '../entities/rubric.entity';
import { RubricController } from './rubric.controller';
import { RubricService } from './rubric.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rubric]),
  ],
  providers: [RubricService],
  controllers: [RubricController],
  exports: [RubricService],
})
export class RubricModule {}
