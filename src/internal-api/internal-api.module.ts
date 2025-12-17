import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InternalApiService } from './internal-api.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,

    HttpModule.register({
      timeout: 500000000,
      maxRedirects: 5,
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('INTERNAL_JWT_SECRET'),
        signOptions: { expiresIn: '1m' },
      }),
    }),
  ],
  providers: [InternalApiService],
  exports: [InternalApiService],
})
export class InternalApiModule {}
