import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

interface AuthenticatedRequest extends Request {
  user: {
    user_id?: number;
  };
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtGuard)
  @Post()
  chat(
    @Body() body: { message: string },
    @Req() request: AuthenticatedRequest,
  ) {
    return this.chatService.getAnswerFromGemini(body.message, this.getUserId(request));
    // return this.chatService.getAnswer(body.message, this.getUserId(request));
  }

  @UseGuards(JwtGuard)
  @Get('history')
  getHistory(@Req() request: AuthenticatedRequest) {
    return this.chatService.getHistory(this.getUserId(request));
  }

  private getUserId(request: AuthenticatedRequest): number {
    const userId = request.user?.user_id;
    if (typeof userId !== 'number' || !Number.isInteger(userId)) {
      throw new UnauthorizedException('Token does not contain a user ID');
    }

    return userId;
  }
}