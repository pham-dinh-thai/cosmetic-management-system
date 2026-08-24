import { NestFactory } from '@nestjs/core';
import { DepartmentServiceModule } from './department-service.module';
import { DEPARTMENT_SERVICE_PORT } from 'constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(DepartmentServiceModule);
  app.setGlobalPrefix('api');
  await app.listen(DEPARTMENT_SERVICE_PORT);
}
bootstrap();
