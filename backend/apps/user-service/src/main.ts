import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { USER_SERVICE_PORT } from '../../../constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  await app.listen(USER_SERVICE_PORT);
}
bootstrap();
