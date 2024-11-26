import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { Connection, ConnectionStates } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Apply global exception filter with ConfigService
  app.useGlobalFilters(new HttpExceptionFilter(configService));

  // Get Mongoose connection instance
  const connection = app.get<Connection>(getConnectionToken());

  // Check initial connection state
  const connectionState = connection.readyState;
  if (connectionState === ConnectionStates.connected) {
    logger.log('MongoDB is already connected');
  } else if (connectionState === ConnectionStates.connecting) {
    logger.log('Connecting to MongoDB...');
  } else {
    logger.warn(`MongoDB connection state: ${connectionState}`);
  }

  connection.on('connected', () => {
    logger.log('MongoDB connected successfully');
  });

  connection.on('disconnected', () => {
    logger.error('MongoDB disconnected');
  });

  connection.on('error', (error) => {
    logger.error('MongoDB connection error:', error);
    // exit the process on critical DB errors
    // process.exit(1);
  });

  connection.on('reconnected', () => {
    logger.log('MongoDB reconnected successfully');
  });

  // Add process handlers for graceful shutdown
  process.on('SIGINT', async () => {
    try {
      await connection.close();
      logger.log('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      logger.error('Error during MongoDB connection closure:', error);
      process.exit(1);
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.useLogger(logger);

  // Setup Swagger first
  const config = new DocumentBuilder()
    .setTitle('Products API')
    .setDescription('The products API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Then start the server
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Error during application bootstrap:', error);
  process.exit(1);
});
