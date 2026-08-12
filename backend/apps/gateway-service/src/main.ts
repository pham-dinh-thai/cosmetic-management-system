import { NestFactory } from '@nestjs/core';
import { GatewayServiceModule } from './gateway-service.module';
import { GATEWAY_SERVICE_PORT } from '../../../constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(GatewayServiceModule);
  await app.listen(GATEWAY_SERVICE_PORT);
}
bootstrap();
