import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {
  UploadCosmeticImageUseCase,
  uploadCosmeticImageUseCaseFactory,
} from './application/use-cases/upload-cosmetic-image/upload-cosmetic-image.use-case';
import { LocalFileStorage } from './infrastructure/storage/local-file-storage';
import { UploadsController } from './presentation/public/uploads/uploads.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadsController],
  providers: [
    LocalFileStorage,
    {
      provide: UploadCosmeticImageUseCase,
      useFactory: uploadCosmeticImageUseCaseFactory,
      inject: [LocalFileStorage],
    },
  ],
})
export class StorageServiceModule {}
