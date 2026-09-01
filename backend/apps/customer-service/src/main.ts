import { NestFactory } from '@nestjs/core';
import { CustomerServiceModule } from './customer-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CUSTOMER_SERVICE_PORT } from 'constants/ports';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(CustomerServiceModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new DomainErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('Customer Service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(CUSTOMER_SERVICE_PORT);
}

void bootstrap();
