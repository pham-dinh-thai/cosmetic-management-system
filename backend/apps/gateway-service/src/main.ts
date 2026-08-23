import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { GatewayServiceModule } from './gateway-service.module';
import { GATEWAY_SERVICE_PORT } from '../../../constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(GatewayServiceModule);
  app.enableCors();
  app.use(helmet());

  const userServiceUrl = process.env.USER_SERVICE_URL;
  const authServiceUrl = process.env.AUTH_SERVICE_URL;
  const authorizationServiceUrl = process.env.AUTHORIZATION_SERVICE_URL;

  app.use(
    createProxyMiddleware({
      target: userServiceUrl,
      changeOrigin: true,
      pathFilter: (pathname) => /^\/api\/users(\/|$)/.test(pathname),
    }),
  );
  app.use(
    createProxyMiddleware({
      target: authServiceUrl,
      changeOrigin: true,
      pathFilter: (pathname) => /^\/api\/auth-users(\/|$)/.test(pathname),
    }),
  );
  app.use(
    createProxyMiddleware({
      target: authorizationServiceUrl,
      changeOrigin: true,
      pathFilter: (pathname) => /^\/api\/roles(\/|$)/.test(pathname),
    }),
  );

  await app.listen(GATEWAY_SERVICE_PORT);
}
bootstrap();
