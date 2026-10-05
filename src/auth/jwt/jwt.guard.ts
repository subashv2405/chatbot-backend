import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (typeof authHeader !== 'string') {
      throw new UnauthorizedException('Token is required');
    }

    const bearerMatch = /^Bearer\s+(\S+)$/i.exec(authHeader.trim());
    if (!bearerMatch) {
      throw new UnauthorizedException(
        'Authorization header must use the Bearer token format',
      );
    }

    try {
      const payload = this.jwtService.verify(bearerMatch[1]);

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}