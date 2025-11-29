import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : [];

  // enableCors 메소드를 사용하여 CORS 활성화 및 세부적인 설정 적용
  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
    // 브라우저에 응답으로 보낼 헤더
    exposedHeaders: 'Authorization',
    // 클라이언트와 서버 간에 인증 정보를 주고받을 수 있도록 함
    credentials: true,
    // Preflight 요청의 캐시 시간 (초 단위)
    maxAge: 3600,
    // Preflight 요청을 계속 진행할지 여부
    preflightContinue: false,
    // Preflight 요청에 대한 응답 상태 코드
    optionsSuccessStatus: 204,
  });

  await app.listen(3000);
}

bootstrap();