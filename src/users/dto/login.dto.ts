import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from '../../common/enum';

export class LoginDto {
  @IsOptional()
  @IsNumber()
  organization_id?: number;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

export class SignupDto {
  @IsString()
  declare name: string;

  @IsEmail()
  declare email: string;

  @IsNotEmpty()
  declare password: string;

  @IsOptional()
  @IsString()
  declare role?: Role;

  @IsNumber()
  declare organization_id: number;
}
