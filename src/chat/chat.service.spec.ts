import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ChatHistory } from './entities/chat-history.entity';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;
  let chatHistoryModel: {
    create: jest.Mock;
    findAll: jest.Mock;
  };

  beforeEach(async () => {
    chatHistoryModel = {
      create: jest.fn().mockResolvedValue(undefined),
      findAll: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(ChatHistory),
          useValue: chatHistoryModel,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('stores the answer with the authenticated user ID', async () => {
    const result = await service.getAnswer('How do I check payroll?', 42);

    expect(result.category).toBe('Payroll');
    expect(chatHistoryModel.create).toHaveBeenCalledWith({
      user_id: 42,
      question: 'How do I check payroll?',
      category: 'Payroll',
      answer:
        'You can check your salary and payslip details in the payroll module.',
    });
  });

  it('only queries history for the authenticated user in chronological order', async () => {
    await service.getHistory(42);

    expect(chatHistoryModel.findAll).toHaveBeenCalledWith({
      where: { user_id: 42 },
      order: [
        ['createdAt', 'ASC'],
        ['id', 'ASC'],
      ],
    });
  });
});
