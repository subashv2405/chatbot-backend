import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeaveRecord } from '../users/entities/leave-record.entity';
import { EmployeeAsset } from '../users/entities/employee-asset.entity';
import { ToolsService } from './tools.service';
import { ChatHistory } from '../chat/entities/chat-history.entity';

@Module({
   imports: [
        SequelizeModule.forFeature([
            LeaveRecord,
            EmployeeAsset,
            ChatHistory,
        ]),
    ],
    controllers: [GeminiController],
    providers: [
        GeminiService,
        ToolsService,
    ],
    exports: [
        GeminiService,
        ToolsService,
    ],
})
export class GeminiModule {}