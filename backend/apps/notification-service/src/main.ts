import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NotificationServiceModule } from './notification-service.module';
import { NOTIFICATION_SERVICE_PORT } from 'constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Notification Service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(NOTIFICATION_SERVICE_PORT);
}

void bootstrap();
