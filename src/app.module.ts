import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { BizwordsModule } from './bizwords/bizwords.module';
import { Bizword } from './bizwords/entities/bizword.entity';
import { RedisModule } from '@nestjs-modules/ioredis';
import { MissionModule } from './mission/mission.module';
import { UserMissionModule } from './user-mission/user-mission.module';
import { Mission } from './mission/entities/mission.entity';
import { UserMission } from './user-mission/entities/user-mission.entity';
import { Rubric } from './rubric/entities/rubric.entity';
import { RubricModule } from './rubric/rubric.module';
import { GradingResult } from './user-mission/entities/grading-result.entity';
import { GradingCriteriaEntity } from './user-mission/entities/grading-criteria.entity';
import { InternalApiModule } from './internal-api/internal-api.module';
import { EmailMission } from './email-mission/entities/email-mission.entity';
import { EmailMissionModule } from './email-mission/email-mission.module';
import { DocumentMissionModule } from './document-mission/document-mission.module';
import { DocumentMission } from './document-mission/entities/document-mission.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DATABASE_HOST'),
        port: configService.getOrThrow<number>('DATABASE_PORT'),
        username: configService.getOrThrow<string>('DATABASE_USER'),
        password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
        database: configService.getOrThrow<string>('DATABASE_NAME'),
        entities: [
          UserEntity,
          Mission,
          UserMission,
          Rubric,
          GradingResult,
          GradingCriteriaEntity,
          Bizword,
          EmailMission,
          DocumentMission,
        ],
        synchronize: false,
      }),
    }),

    AuthModule,
    UserModule,
    MailModule,
    MissionModule,
    RubricModule,
    BizwordsModule,
    RedisModule,
    UserMissionModule,
    EmailMissionModule,
    DocumentMissionModule,
    InternalApiModule,
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.getOrThrow<string>('REDIS_HOST'),
        port: configService.getOrThrow<number>('REDIS_PORT'),
        db: 0,
        ttl: configService.getOrThrow<number>('REDIS_TTL'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
