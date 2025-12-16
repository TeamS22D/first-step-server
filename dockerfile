FROM node:22.18.0-alpine

WORKDIR /app

# 의존성 설치 (캐시 최적화)
COPY package*.json ./
RUN npm ci

# 소스 코드 복사
COPY . .

# NestJS 빌드
RUN npm run build

#포트 개방 (문서용)
EXPOSE 3000

# 컨테이너 실행
CMD ["node", "dist/main.js"]
