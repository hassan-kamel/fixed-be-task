import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  constructor(private jwtService: JwtService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // Extract user info from JWT token if present
    let userInfo = 'Anonymous';
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = this.jwtService.verify(token);
        userInfo = `${decoded.email} (${decoded.role})`;
      } catch {
        userInfo = 'Invalid Token';
      }
    }

    // Log the incoming request with user info
    this.logger.log(
      `[Incoming Request] ${method} ${originalUrl} - ${ip} - ${userAgent} - User: ${userInfo}`,
    );

    // Log request body if present
    if (Object.keys(request.body).length) {
      this.logger.debug('Request Body:', request.body);
    }

    // Capture response using event listener
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `[Response] ${method} ${originalUrl} ${statusCode} ${contentLength}B - ${responseTime}ms - User: ${userInfo}`,
      );
    });

    next();
  }
}
