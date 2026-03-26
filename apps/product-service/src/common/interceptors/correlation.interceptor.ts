import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';

@Injectable()
export class CorrelationInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() === 'rpc') {
      const data: unknown = context.switchToRpc().getData();
      const record =
        typeof data === 'object' && data !== null
          ? (data as Record<string, unknown>)
          : undefined;
      const meta = record?.['_meta'] as Record<string, unknown> | undefined;
      const correlationId = meta?.correlationId as string | undefined;
      if (correlationId) {
        this.cls.set('correlationId', correlationId);
      }
    }
    return next.handle();
  }
}
