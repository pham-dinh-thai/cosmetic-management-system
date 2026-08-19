import { NestFactory } from '@nestjs/core';
import { AuthenticationServiceModule } from './authentication-service.module';
import { AUTHENTICATION_SERVICE_PORT } from '../../../constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationServiceModule);
  app.setGlobalPrefix('api');
  await app.listen(AUTHENTICATION_SERVICE_PORT);
}
bootstrap();
