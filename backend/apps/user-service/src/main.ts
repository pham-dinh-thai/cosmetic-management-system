import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { USER_SERVICE_PORT } from '../../../constants/ports';
import { EmailAlreadyTakenFilter } from './presentation/filters/email-already-taken.filter';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  app.useGlobalFilters(new EmailAlreadyTakenFilter());
  await app.listen(USER_SERVICE_PORT);
}
bootstrap();
