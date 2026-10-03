import {
  BadRequestException,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/enum';
import { responseMessageGenerator } from '../common/helpers/helpers.service';
import { LoginDto, SignupDto } from './dto/login.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
        @Optional() @InjectModel(User) private readonly userModel?: typeof User,
        @Optional() private readonly jwtService?: JwtService,
    ) {}

    private async signToken(payload: Record<string, unknown>) {
        if (!this.jwtService) {
        return 'dev-token';
        }

        return this.jwtService.signAsync(payload);
    }

    async login(data: LoginDto) {
        try {
            
            if (!this.userModel) {
                throw new UnauthorizedException('User model is not available');
            }

            const user = await this.userModel.findOne({
                where: { email: data.email },
            });

            if (!user) {
                throw new UnauthorizedException();
            }

            const isValid = await bcrypt.compare(data.password, user.password);

            if (!isValid) {
                throw new UnauthorizedException();
            }

            const response = {
                access_token: await this.signToken({ role: user.role ?? Role.SUPER_ADMIN, user_id: user.id }),
                // organization_id: user.organization_id ?? null,
                // role: user.role ?? Role.END_USER,
                user_id: user.id,
            };

            return responseMessageGenerator('success', 'Login successfully', response);
        } catch (error) {
            return await responseMessageGenerator(
                'error',
                error instanceof Error ? error.message : 'An error occurred',
                null,
            );
        }
    }

  async signup(data: SignupDto) {
    try {
        if (!this.userModel) {
            throw new BadRequestException('User model is not available');
        }

        const existingUser = await this.userModel.findOne({
            where: {
            email: data.email,
            },
        });

        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.userModel.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            organization_id: data.organization_id,
            role: data.role || Role.SUPER_ADMIN,
        });

        return await responseMessageGenerator(
            'success',
            'User registered successfully',
            user,
        );
    } catch (error) {
        return await responseMessageGenerator(
            'error',
            error instanceof Error ? error.message : 'An error occurred',
            null,
        );
    }
  }
}
