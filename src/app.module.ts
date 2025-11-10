import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.SQL_HOST,
      port: 3306,
      username: process.env.SQL_NAME,
      password: process.env.SQL_SECRET,
      database: 'user',
      entities: [UserEntity],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    MailModule,
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.getOrThrow<string>('REDIS_HOST'),
        port: configService.getOrThrow<number>('REDIS_PORT'),
        db: 0,
        ttl: 300,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }