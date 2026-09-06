import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import express from 'express';
import { StorageServiceModule } from './storage-service.module';
import { STORAGE_SERVICE_PORT } from '../../../constants/ports';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(StorageServiceModule);
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const uploadRoot = configService.get<string>('UPLOAD_ROOT') ?? './uploads';
  const absoluteUploadRoot = join(process.cwd(), uploadRoot);

  if (!existsSync(absoluteUploadRoot)) {
    mkdirSync(absoluteUploadRoot, { recursive: true });
  }

  app.use('/api/uploads', express.static(absoluteUploadRoot, { maxAge: '7d' }));

  const config = new DocumentBuilder()
    .setTitle('Storage Service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(STORAGE_SERVICE_PORT);
}

void bootstrap();
