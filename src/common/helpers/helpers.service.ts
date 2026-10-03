import { Injectable } from '@nestjs/common';

@Injectable()
export class HelpersService {
    
}

export async function responseMessageGenerator(status: string, message: string, data: any): Promise<any> {
    return {
        status: status,
        message: message,
        data: data ? data : null
    };
}