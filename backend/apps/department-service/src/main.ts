import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DepartmentServiceModule } from './department-service.module';
import { DEPARTMENT_SERVICE_PORT } from 'constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(DepartmentServiceModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Department Service API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(DEPARTMENT_SERVICE_PORT);
}
bootstrap();
