import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UsersModule } from '../users/users.module';
import { ChatHistory } from './entities/chat-history.entity';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [AuthModule, UsersModule, GeminiModule, SequelizeModule.forFeature([ChatHistory])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
