// src/common/decorators/rate-limit.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rateLimit';
export const RateLimit = (ttl: number, limit: number) =>
  SetMetadata(RATE_LIMIT_KEY, { ttl, limit });
