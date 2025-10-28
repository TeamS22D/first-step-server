import { Module } from '@nestjs/common';
import { BizwordsService } from './bizwords.service';
import { BizwordsController } from './bizwords.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bizword } from './entities/bizword.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bizword]),
  ],
  controllers: [BizwordsController],
  providers: [BizwordsService],
})
export class BizwordsModule {}