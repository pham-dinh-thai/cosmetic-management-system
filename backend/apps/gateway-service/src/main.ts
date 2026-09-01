import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
  type OpenAPIObject,
  type PathItemObject,
} from '@nestjs/swagger';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { GatewayServiceModule } from './gateway-service.module';
import { GATEWAY_SERVICE_PORT } from '../../../constants/ports';

interface ServiceDocsSource {
  name: string;
  url: string | undefined;
}

interface ServiceDocument {
  paths?: Record<string, PathItemObject>;
  components?: { schemas?: Record<string, unknown> };
}

const SERVICE_DOCS_SOURCES: ServiceDocsSource[] = [
  { name: 'users', url: process.env.USER_SERVICE_URL },
  { name: 'auth', url: process.env.AUTH_SERVICE_URL },
  { name: 'roles', url: process.env.AUTHORIZATION_SERVICE_URL },
  { name: 'departments', url: process.env.DEPARTMENT_SERVICE_URL },
  { name: 'employees', url: process.env.EMPLOYEE_SERVICE_URL },
  { name: 'customers', url: process.env.CUSTOMER_SERVICE_URL },
];

async function fetchServiceDocument(
  source: ServiceDocsSource,
): Promise<ServiceDocument | null> {
  if (!source.url) {
    console.warn(`[gateway] docs source ${source.name} has no URL configured`);
    return null;
  }
  try {
    const response = await fetch(`${source.url}/api/docs-json`);
    return (await response.json()) as ServiceDocument;
  } catch {
    console.warn(
      `[gateway] cannot load API docs from ${source.name} (${source.url})`,
    );
    return null;
  }
}

async function buildAggregatedDocument(): Promise<OpenAPIObject> {
  const document = new DocumentBuilder()
    .setTitle('Cosmetic Management System API')
    .setVersion('1.0')
    .build();

  const aggregate: OpenAPIObject = {
    ...document,
    paths: {},
    components: { schemas: {} },
    tags: [],
  };

  for (const source of SERVICE_DOCS_SOURCES) {
    const serviceDocument = await fetchServiceDocument(source);
    if (!serviceDocument) {
      continue;
    }

    aggregate.tags = aggregate.tags ?? [];
    aggregate.tags.push({ name: source.name });

    for (const [path, pathItem] of Object.entries(
      serviceDocument.paths ?? {},
    )) {
      if (!pathItem) {
        continue;
      }
      const pathAggregate: PathItemObject = { ...pathItem };
      for (const [method, operation] of Object.entries(pathItem)) {
        if (typeof operation !== 'object' || operation === null) {
          continue;
        }
        (pathAggregate as Record<string, unknown>)[method] = {
          ...(operation as object),
          tags: [source.name],
        };
      }
      aggregate.paths[path] = pathAggregate;
    }

    const schemas = serviceDocument.components?.schemas;
    if (schemas && aggregate.components) {
      Object.assign(aggregate.components.schemas ?? {}, schemas);
    }
  }

  return aggregate;
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
  app.use(
    createProxyMiddleware({
      target: process.env.CUSTOMER_SERVICE_URL,
      changeOrigin: true,
      pathFilter: (pathname) => /^\/api\/customers(\/|$)/.test(pathname),
    }),
  );

  const baseDocument: OpenAPIObject = {
    ...new DocumentBuilder()
      .setTitle('Cosmetic Management System API')
      .setVersion('1.0')
      .build(),
    paths: {},
  };

  SwaggerModule.setup('api/docs', app, baseDocument, {
    patchDocumentOnRequest: async () => buildAggregatedDocument(),
  });

  await app.listen(GATEWAY_SERVICE_PORT);
}

void bootstrap();
