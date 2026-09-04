import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PurchaseServiceModule } from './purchase-service.module';
import { PURCHASE_SERVICE_PORT } from 'constants/ports';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(PurchaseServiceModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new DomainErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('Purchase Order Service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PURCHASE_SERVICE_PORT);
}

void bootstrap();
