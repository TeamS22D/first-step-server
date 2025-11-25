import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import type { Request } from 'express';

export interface DocumentEvaluationRequest {
  mission_id: string;
  user_mission: string;
}

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() body: any) {
    return await this.aiService.chat(body);
  }

  @Post('evaluate')
  async evaluate(@Body() body: DocumentEvaluationRequest) {
    return await this.aiService.evaluateDocument(body);
  }
}
