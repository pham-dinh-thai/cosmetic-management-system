import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InventoryServiceModule } from './inventory-service.module';
import { INVENTORY_SERVICE_PORT } from 'constants/ports';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(InventoryServiceModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new DomainErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('Inventory Service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(INVENTORY_SERVICE_PORT);
}

void bootstrap();
