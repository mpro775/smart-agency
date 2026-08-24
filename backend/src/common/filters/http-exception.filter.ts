import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string[] | undefined;
    let code: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || message;
        code = responseObj.code as string | undefined;

        // Handle validation errors
        if (Array.isArray(responseObj.message)) {
          errors = responseObj.message;
          message = 'Validation failed';
          code = 'VALIDATION_ERROR';
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    const resource = request.path
      .split('/')
      .filter(Boolean)
      .filter((segment) => !['api', 'public', 'admin'].includes(segment))[0]
      ?.replace(/-/g, '_')
      .toUpperCase();
    const statusCodeName: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      429: 'RATE_LIMITED',
      500: 'INTERNAL_ERROR',
    };

    response.status(status).json({
      statusCode: status,
      code:
        code ||
        (resource
          ? `${resource}_${statusCodeName[status] || 'ERROR'}`
          : statusCodeName[status] || 'ERROR'),
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
