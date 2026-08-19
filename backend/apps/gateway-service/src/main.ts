import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { GatewayServiceModule } from './gateway-service.module';
import { GATEWAY_SERVICE_PORT } from '../../../constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(GatewayServiceModule);
  app.enableCors();
  app.use(helmet());

  const userServiceUrl =
    process.env.USER_SERVICE_URL ?? 'http://localhost:3001';
  const authServiceUrl =
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:3002';

  app.use(
    createProxyMiddleware({
      target: userServiceUrl,
      changeOrigin: true,
      pathFilter: '/api/users',
    }),
  );
  app.use(
    createProxyMiddleware({
      target: authServiceUrl,
      changeOrigin: true,
      pathFilter: '/api/auth',
    }),
  );

  await app.listen(GATEWAY_SERVICE_PORT);
}
bootstrap();
