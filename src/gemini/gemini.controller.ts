import { Controller, Get } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Get('test')
  async testGemini() {
    // const answer = await this.geminiService.askGemini(
    //   'Explain what NestJS is in one simple sentence.',
    // );
const intent = await this.geminiService.detectIntent(
    'I want to know about my salary.',
  );
    return {
    //   answer,
      intent,
    };
  }
}