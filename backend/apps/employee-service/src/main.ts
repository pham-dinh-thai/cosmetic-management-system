import { NestFactory } from '@nestjs/core';
import { EmployeeServiceModule } from './employee-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EMPLOYEE_SERVICE_PORT } from 'constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(EmployeeServiceModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Employee Service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(EMPLOYEE_SERVICE_PORT);
}
bootstrap();
