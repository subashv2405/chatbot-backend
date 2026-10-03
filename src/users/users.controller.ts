import { Body, Controller, Optional, Post } from '@nestjs/common';
import { LoginDto, SignupDto } from './dto/login.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @Optional() private readonly userService?: UsersService,
  ) {}

  @Post('login')
  async login(@Body() data: LoginDto): Promise<any> {
    if (!this.userService) {
      return { status: 'error', message: 'User service unavailable', data: null };
    }

    return await this.userService.login(data);
    
  }


    @Post('register')
    async signup(@Body() data:SignupDto): Promise<any> {
      if (!this.userService) {
        return { status: 'error', message: 'User service unavailable', data: null };
      }

        return await this.userService.signup(data)  
    }
}
