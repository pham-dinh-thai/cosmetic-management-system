import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthenticationServiceModule } from './authentication-service.module';
import { AUTHENTICATION_SERVICE_PORT } from '../../../constants/ports';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationServiceModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Authentication Service API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(AUTHENTICATION_SERVICE_PORT);
}
bootstrap();
