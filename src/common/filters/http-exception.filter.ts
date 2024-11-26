import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse();
    const isDevelopment = this.configService.get('NODE_ENV') === 'development';

    // Log the full error in server logs
    this.logger.error('HTTP Exception:', exception.stack);

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      error: error,
      ...(isDevelopment && { stack: exception.stack }), // Only include stack trace in development
    };

    response.status(status).json(errorResponse);
  }
}
