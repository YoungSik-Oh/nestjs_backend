import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
  private logger = new Logger(AccessLogInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const { method, url, body, http } = context.getArgByIndex(0);
    const value = context.switchToHttp().getRequest().headers;

    return next.handle().pipe(
      tap((data) => {
        const result = { Request: { header: value }, Response: data };

        this.logger.log(
          `[${method}] ${url}\n ${JSON.stringify(result, null, 3)}`,
        );
      }),
    );
  }
}
