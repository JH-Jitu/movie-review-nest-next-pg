// src/common/guards/rate-limit.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY, RateLimit } from '../decorators/rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly rateLimits = new Map<
    string,
    { count: number; timestamp: number }
  >();

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rateLimit = this.reflector.get<{
      ttl: number;
      limit: number;
    }>(RATE_LIMIT_KEY, context.getHandler());

    if (!rateLimit) return true;

    const request = context.switchToHttp().getRequest();
    const key = `${request.user.id}-${context.getHandler().name}`;
    const now = Date.now();

    const userRateLimit = this.rateLimits.get(key);

    if (!userRateLimit || now - userRateLimit.timestamp > rateLimit.ttl) {
      this.rateLimits.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (userRateLimit.count >= rateLimit.limit) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    userRateLimit.count++;
    return true;
  }
}
