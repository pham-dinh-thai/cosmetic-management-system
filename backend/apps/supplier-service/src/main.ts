import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SupplierServiceModule } from './supplier-service.module';
import { SUPPLIER_SERVICE_PORT } from 'constants/ports';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(SupplierServiceModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new DomainErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('Supplier Service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(SUPPLIER_SERVICE_PORT);
}

void bootstrap();