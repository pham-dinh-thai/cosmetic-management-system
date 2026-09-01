import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthorizationServiceModule } from './authorization-service.module';
import { AUTHORIZATION_SERVICE_PORT } from '../../../constants/ports';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AuthorizationServiceModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new DomainErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('Authorization Service API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(AUTHORIZATION_SERVICE_PORT);
}

void bootstrap();
