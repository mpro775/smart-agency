import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator';
import { localizePublicData, resolveLocale } from '../localization/locale';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export const RESPONSE_MESSAGE_KEY = 'response_message';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ||
      'Success';

    return next.handle().pipe(
      map((data) => {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
          IS_PUBLIC_KEY,
          [context.getHandler(), context.getClass()],
        );
        const request = context.switchToHttp().getRequest<Request>();
        const localizedData = isPublic
          ? localizePublicData(data, resolveLocale(request))
          : data;
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        // Check if data has pagination info
        if (
          localizedData &&
          typeof localizedData === 'object' &&
          'items' in localizedData &&
          'meta' in localizedData
        ) {
          return {
            statusCode,
            message,
            data: localizedData.items,
            meta: localizedData.meta,
          };
        }

        return {
          statusCode,
          message,
          data: localizedData,
        };
      }),
    );
  }
}
