import {
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtGuard } from './jwt.guard';

describe('JwtGuard', () => {
  const payload = { user_id: 42 };
  const jwtService = {
    verify: jest.fn().mockReturnValue(payload),
  };
  const guard = new JwtGuard(jwtService as unknown as JwtService);

  function createContext(authorization?: string) {
    const request: { headers: { authorization?: string }; user?: unknown } = {
      headers: { authorization },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    return { context, request };
  }

  beforeEach(() => {
    jwtService.verify.mockClear();
  });

  it('verifies a Bearer token and attaches its payload to the request', () => {
    const { context, request } = createContext('Bearer valid.token');

    expect(guard.canActivate(context)).toBe(true);
    expect(jwtService.verify).toHaveBeenCalledWith('valid.token');
    expect(request.user).toEqual(payload);
  });

  it('accepts a case-insensitive Bearer scheme', () => {
    const { context } = createContext('bearer valid.token');

    expect(guard.canActivate(context)).toBe(true);
    expect(jwtService.verify).toHaveBeenCalledWith('valid.token');
  });

  it('rejects a missing authorization header', () => {
    const { context } = createContext();

    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException('Token is required'),
    );
  });

  it('rejects an authorization header without the Bearer scheme', () => {
    const { context } = createContext('valid.token');

    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException(
        'Authorization header must use the Bearer token format',
      ),
    );
    expect(jwtService.verify).not.toHaveBeenCalled();
  });

  it('rejects an invalid or expired token', () => {
    jwtService.verify.mockImplementationOnce(() => {
      throw new Error('invalid token');
    });
    const { context } = createContext('Bearer invalid.token');

    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException('Invalid or expired token'),
    );
  });
});
