import { TOKEN_INVALID_OR_EXPIRED } from './../constants/messages.constants';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { TOKEN_NOT_PROVIDED } from '../constants/messages.constants';
import { JwtRefreshInterface } from '../interfaces/jwt-refresh.interface';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = this.extractTokenFromHeader(request);
    if (!refreshToken) {
      throw new UnauthorizedException(TOKEN_NOT_PROVIDED);
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtRefreshInterface>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );
      request['user'] = { sub: payload.sub, refreshToken };
      return true;
    } catch {
      throw new UnauthorizedException(TOKEN_INVALID_OR_EXPIRED);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
