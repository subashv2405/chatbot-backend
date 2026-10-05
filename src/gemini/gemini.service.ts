import { Injectable } from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';
import { ToolsService } from './tools.service';
import { InjectModel } from '@nestjs/sequelize';
import { ChatHistory } from '../chat/entities/chat-history.entity';

@Injectable()
export class GeminiService {
  private readonly ai: GoogleGenAI;

  constructor(
    @InjectModel(ChatHistory)
    private readonly chatHistoryModel: typeof ChatHistory,
    private readonly toolsService: ToolsService,
  ) {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async askWithTools(
    question: string,
    userId: number,
  ): Promise<string> {
    // 1. Gemini tool definitions
    const tools = [
      {
        functionDeclarations: [
          {
            name: 'get_leave_balance',
            description:
              'Get the authenticated employee leave balance, including total, used and remaining leave days.',
            parameters: {
              type: Type.OBJECT,
              properties: {},
            },
          },
          {
            name: 'get_employee_assets',
            description:
              'Get the assets currently assigned to the authenticated employee.',
            parameters: {
              type: Type.OBJECT,
              properties: {},
            },
          },
        ],
      },
    ];

    // 2. Tool registry
    const toolHandlers: Record<string, () => Promise<unknown>> = {
      get_leave_balance: () =>
        this.toolsService.getLeaveBalance(userId),

      get_employee_assets: () =>
        this.toolsService.getEmployeeAssets(userId),
    };

    
    // Fetch previous chat history for context
    const previousChats = await this.chatHistoryModel.findAll({
      where: {
        user_id: userId,
      },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    previousChats.reverse();
    const conversationHistory = previousChats.flatMap((chat) => [
      {
        role: 'user',
        parts: [{ text: chat.question }],
      },
      {
        role: 'model',
        parts: [{ text: chat.answer }],
      },
    ]);

    // 3. Ask Gemini
    const response = await this.ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      // contents: question,
      contents: [
        ...conversationHistory,
        {
          role: 'user',
          parts: [{ text: question }],
        },
      ],
      config: {
        tools,
      },
    });

    const functionCalls = response.functionCalls;

    if (!functionCalls?.length) {
      const finalResult = response.text ?? 'Sorry, I could not generate a response.';
      await this.chatHistoryModel.create({
        user_id: userId,
        question: question,
        answer: finalResult,
        category: "Gemini AI",
      });
      return finalResult;
    }

    // 5. Execute Gemini's requested tools
    const functionResponses = await Promise.all(
      functionCalls.map(async (functionCall) => {
        const toolName = functionCall?.name;

        if (!toolName) {
          throw new Error('Gemini tool call is missing a name.');
        }

        const handler = toolHandlers[toolName];

        if (!handler) {
          throw new Error(
            `Unknown tool requested by Gemini: ${toolName}`,
          );
        }

        const result = await handler();

        return {
          functionResponse: {
            name: toolName,
            response: { output: result },
          },
        };
      }),
    );

    // 6. Send tool results back to Gemini
    const finalResponse = await this.ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: [
        ...conversationHistory,
        {
          role: 'user',
          parts: [
            {
              text: question,
            },
          ],
        },
        {
          role: 'model',
          parts: response.candidates?.[0]?.content?.parts ?? [],
        },
        {
          role: 'user',
          parts: functionResponses,
        },
      ],
      config: {
        tools,
      },
    });

    const finalResult =  finalResponse.text ?? 'Sorry, I could not generate a response.';
    await this.chatHistoryModel.create({
      user_id: userId,
      question: question,
      answer: finalResult,
      category: "Application Tools",
    });
    return finalResult;
  }

  async askGemini(question: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: question,
    });

    return response.text ?? 'No response from Gemini';
  }

  async detectIntent(question: string): Promise<string> {
    try{
      const prompt = `
        You are an intent classification system for an HRMS chatbot.

        Classify the user's question into exactly ONE of these intents:

        CHECK_LEAVE_BALANCE
        LEAVE_POLICY
        PAYROLL
        ASSET
        GENERAL

        Return ONLY the intent name.
        Do not provide any explanation.

        User question:
        ${question}
      `;

      const response = await this.ai.models.generateContent({
          model: 'gemini-3.5-flash-lite',
          contents: prompt,
      });

      return response.text?.trim() ?? 'GENERAL';
    }catch (error) {
      console.error('Error detecting intent:', error);
      return 'GENERAL';
    }
  }
}