import { Module } from '@nestjs/common';
import { BizwordsService } from './bizwords.service';
import { BizwordsController } from './bizwords.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bizword } from './entities/bizword.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bizword, UserEntity])],
  controllers: [BizwordsController],
  providers: [BizwordsService],
})
export class BizwordsModule {}
