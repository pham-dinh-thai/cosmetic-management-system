import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserServiceModule } from './user-service.module';
import { USER_SERVICE_PORT } from '../../../constants/ports';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new DomainErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(USER_SERVICE_PORT);
}
bootstrap();
