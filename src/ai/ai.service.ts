import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

export interface DocumentEvaluationRequest {
  mission_id: string;
  user_mission: string;
}

@Injectable()
export class AiService {
  private readonly fastApiUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    // FASTAPI_URL 환경변수를 가져오고, 없으면 에러 발생
    this.fastApiUrl = this.configService.getOrThrow<string>('FASTAPI_URL');
  }

  /**
   * 프론트에서 받은 메시지 배열을 FastAPI로 전달하고 결과를 반환
   * @param messages Chat 메시지 배열 [{role: "user", content: "Hello"}]
   * @returns FastAPI에서 받은 응답 JSON
   */
  async chat(messages: any[]) {
    try {
      // POST 요청으로 body에 messages 전달
      const { data } = await firstValueFrom(
        this.http.get(`${this.fastApiUrl}/`, {
          params: { messages: JSON.stringify(messages) },
          timeout: 1000000,
        }),
      );

      return data;
    } catch (err: any) {
      console.error('[FastAPI Error]', err?.message || err);
      throw new HttpException('AI 서버 통신 오류', 500);
    }
  }

  /**
   * FastAPI /evaluate 호출
   */
  async evaluateDocument(request: DocumentEvaluationRequest) {
    try {
      const { data } = await firstValueFrom(
        this.http.post(`${this.fastApiUrl}/api/v1/ai/document/evaluate`, request, { timeout: 10000 }),
      );
      return data;
    } catch (err: any) {
      console.error('[FastAPI Error]', err?.message || err);
      throw new HttpException('AI 서버 문서 평가 실패', 500);
    }
  }
}
