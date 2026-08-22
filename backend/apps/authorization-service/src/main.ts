import { NestFactory } from '@nestjs/core';
import { AuthorizationServiceModule } from './authorization-service.module';
import { AUTHORIZATION_SERVICE_PORT } from '../../../constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(AuthorizationServiceModule);

  await app.listen(AUTHORIZATION_SERVICE_PORT);
}
bootstrap();
