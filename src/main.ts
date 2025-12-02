import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : [];
  
  //TODO: CORS 설정 수정 필요!!!!
  // enableCors 메소드를 사용하여 CORS 활성화 및 세부적인 설정 적용
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Authorization', 'Content-Type'], // 명시적으로 허용
    exposedHeaders: ['Authorization'],
    credentials: true,
    maxAge: 3600,
    preflightContinue: false,
    optionsSuccessStatus: 204,
});

  await app.listen(3000);
}

bootstrap();