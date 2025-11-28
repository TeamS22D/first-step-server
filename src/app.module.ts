import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './entities/user.entity';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { RedisModule } from '@nestjs-modules/ioredis';
import { MissionModule } from './mission/mission.module';
import { UserMissionController } from './user-mission/user-mission.controller';
import { UserMissionModule } from './user-mission/user-mission.module';
import { Mission } from './entities/mission.entity';
import { UserMission } from './entities/user-mission.entity';
import { Rubric } from './entities/rubric.entity';
import { RubricModule } from './rubric/rubric.module';
import { MissionController } from './mission/mission.controller';
import { RubricController } from './rubric/rubric.controller';
import { GradingResult } from './entities/grading-result.entity';

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
        entities: [UserEntity, Mission, UserMission, Rubric, GradingResult],
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    MailModule,
    MissionModule,
    RubricModule,
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
    RedisModule,
    UserMissionModule,
  ],
  controllers: [
    AppController,
    UserMissionController,
    MissionController,
    RubricController,
  ],
  providers: [AppService],
})
export class AppModule {}
