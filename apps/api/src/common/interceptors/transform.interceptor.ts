// src/common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data?.meta) {
          // WARN: If it's already a paginated response, return as is
          return data;
        }
        // TODO: Wrap other responses in a data property
        return {
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
