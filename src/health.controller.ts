import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { Logger } from '@nestjs/common';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private mongooseHealth: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    try {
      return await this.health.check([
        // MongoDB health check
        () => this.mongooseHealth.pingCheck('mongodb'),
      ]);
    } catch (error) {
      this.logger.error('Health check failed:', error);
      throw error;
    }
  }

  @Get('mongodb')
  @HealthCheck()
  async checkMongo(): Promise<HealthCheckResult> {
    try {
      return await this.health.check([
        () => this.mongooseHealth.pingCheck('mongodb'),
      ]);
    } catch (error) {
      this.logger.error('MongoDB health check failed:', error);
      throw error;
    }
  }
}
