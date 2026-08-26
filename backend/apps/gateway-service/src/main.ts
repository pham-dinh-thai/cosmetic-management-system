import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { GatewayServiceModule } from './gateway-service.module';
import { GATEWAY_SERVICE_PORT } from '../../../constants/ports';

interface ServiceDocsSource {
  name: string;
  url: string | undefined;
}

const SERVICE_DOCS_SOURCES: ServiceDocsSource[] = [
  { name: 'users', url: process.env.USER_SERVICE_URL },
  { name: 'auth', url: process.env.AUTH_SERVICE_URL },
  { name: 'roles', url: process.env.AUTHORIZATION_SERVICE_URL },
  { name: 'departments', url: process.env.DEPARTMENT_SERVICE_URL },
  { name: 'employees', url: process.env.EMPLOYEE_SERVICE_URL },
];

async function fetchServiceDocument(source: ServiceDocsSource): Promise<any> {
  if (!source.url) {
    console.warn(`[gateway] docs source ${source.name} has no URL configured`);
    return null;
  }
  try {
    const response = await fetch(`${source.url}/api/docs-json`);
    return await response.json();
  } catch {
    console.warn(
      `[gateway] cannot load API docs from ${source.name} (${source.url})`,
    );
    return null;
  }
}

async function buildAggregatedDocument(): Promise<any> {
  const document = new DocumentBuilder()
    .setTitle('Cosmetic Management System API')
    .setVersion('1.0')
    .build() as any;

  document.paths = {};
  document.components = { schemas: {} };
  document.tags = [];

  for (const source of SERVICE_DOCS_SOURCES) {
    const serviceDocument = await fetchServiceDocument(source);
    if (!serviceDocument) {
      continue;
    }

    document.tags.push({ name: source.name });

    for (const [path, methods] of Object.entries<any>(
      serviceDocument.paths ?? {},
    )) {
      document.paths[path] = {};
      for (const [method, operation] of Object.entries<any>(methods)) {
        document.paths[path][method] = { ...operation, tags: [source.name] };
      }
    }

    Object.assign(
      document.components.schemas,
      serviceDocument.components?.schemas ?? {},
    );
  }

  return document;
}

async function bootstrap() {
  const app = await NestFactory.create(GatewayServiceModule);
  app.enableCors();
  app.use(helmet({ contentSecurityPolicy: false }));

  app.use(
    createProxyMiddleware({
      target: process.env.USER_SERVICE_URL,
      changeOrigin: true,
      pathFilter: (pathname) => /^\/api\/users(\/|$)/.test(pathname),
    }),
  );
  app.use(
    createProxyMiddleware({
      target: process.env.AUTH_SERVICE_URL,
      changeOrigin: true,
      pathFilter: (pathname) => /^\/api\/auth-users(\/|$)/.test(pathname),
    }),
  );
  app.use(
    createProxyMiddleware({
      target: process.env.AUTHORIZATION_SERVICE_URL,
      changeOrigin: true,
      pathFilter: (pathname) => /^\/api\/roles(\/|$)/.test(pathname),
    }),
  );
  app.use(
    createProxyMiddleware({
      target: process.env.DEPARTMENT_SERVICE_URL,
      changeOrigin: true,
      pathFilter: (pathname) => /^\/api\/departments(\/|$)/.test(pathname),
    }),
  );
  app.use(
    createProxyMiddleware({
      target: process.env.EMPLOYEE_SERVICE_URL,
      changeOrigin: true,
      pathFilter: (pathname) => /^\/api\/employees(\/|$)/.test(pathname),
    }),
  );

  const baseDocument = new DocumentBuilder()
    .setTitle('Cosmetic Management System API')
    .setVersion('1.0')
    .build() as any;
  SwaggerModule.setup('api/docs', app, baseDocument, {
    patchDocumentOnRequest: async () => buildAggregatedDocument(),
  } as any);

  await app.listen(GATEWAY_SERVICE_PORT);
}
bootstrap();
