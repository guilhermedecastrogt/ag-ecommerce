import { ServiceUnavailableException } from '@nestjs/common';
import { Observable, TimeoutError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

export interface ResilienceOptions {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

const DEFAULTS: Required<ResilienceOptions> = {
  timeoutMs: 5000,
  retries: 2,
  retryDelayMs: 300,
};

export function withResilience<T>(
  obs: Observable<T>,
  opts: ResilienceOptions = {},
): Observable<T> {
  const { timeoutMs, retries, retryDelayMs } = { ...DEFAULTS, ...opts };

  return obs.pipe(
    timeout(timeoutMs),
    retry({ count: retries, delay: retryDelayMs }),
    catchError((err: unknown) => {
      if (err instanceof TimeoutError) {
        throw new ServiceUnavailableException('Downstream service timeout');
      }
      throw err;
    }),
  );
}
