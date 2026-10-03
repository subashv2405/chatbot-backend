import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './jwt/jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'change-me',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtGuard],
  exports: [JwtModule, JwtGuard],
})
export class AuthModule {}
