import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatHistory } from './entities/chat-history.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(ChatHistory)
        private readonly chatHistoryModel: typeof ChatHistory,
    ) {}

    private categories = [
        {
        name: 'HR',
        keywords: ['hr', 'human resource', 'employee'],
        answer: 'You can contact the HR team for employee-related queries.',
        },
        {
        name: 'Leave',
        keywords: ['leave', 'vacation', 'holiday'],
        answer: 'You can apply for leave through the HRMS leave module.',
        },
        {
        name: 'Payroll',
        keywords: ['salary', 'payroll', 'payslip'],
        answer: 'You can check your salary and payslip details in the payroll module.',
        },
        {
        name: 'Attendance',
        keywords: ['attendance', 'absent', 'present', 'working hours'],
        answer: 'You can check your attendance and working hours in the attendance module.',
        },
        {
        name: 'Company Policy',
        keywords: ['policy', 'rules', 'company rules'],
        answer: 'Please check the company policy section or contact HR for more details.',
        },
    ];

    async getAnswer(message: string, userId: number) {
    try {
        const userMessage = message.toLowerCase();

        let bestCategory = null;
        let highestScore = 0;

        for (const category of this.categories) {
            let score = 0;

            for (const keyword of category.keywords) {
                if (userMessage.includes(keyword)) {
                score++;
                }
            }

            if (score > highestScore) {
                highestScore = score;
                bestCategory = category;
            }
        }

        const result = bestCategory
        ? { category: bestCategory.name, answer: bestCategory.answer }
        : {
            category: 'Unknown',
            answer: 'Sorry, I could not understand your question.',
            };

        await this.chatHistoryModel.create({
            user_id: userId,
            question: message,
            ...result,
        });

        return result;
    } catch (error) {
        throw new Error('Error processing the chat message');
    }
  }

    async getHistory(userId: number) {
        try{
            const history = await this.chatHistoryModel.findAll({
                where: { user_id: userId },
                order: [
                    ['createdAt', 'ASC'],
                    ['id', 'ASC'],
                ],
            });

            return history.map(({ id, question, answer, category, createdAt }) => ({
                id,
                question,
                answer,
                category,
                createdAt,
            }));
        }catch (error) {
            throw new Error('Error fetching chat history');
        }
    }
}