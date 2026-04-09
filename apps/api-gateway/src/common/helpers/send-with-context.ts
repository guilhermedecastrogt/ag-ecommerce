import { ClsService } from 'nestjs-cls';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export function sendWithContext<T>(
  client: ClientProxy,
  pattern: string,
  data: unknown,
  cls: ClsService,
): Observable<T> {
  const correlationId = cls.get<string>('correlationId');
  const payload = { ...(data as object), _meta: { correlationId } };
  return client.send<T>(pattern, payload);
}
