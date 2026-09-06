import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadsController } from './presentation/public/uploads/uploads.controller';
import { LocalFileStorage } from './infrastructure/storage/local-file-storage';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
  ],
  controllers: [UploadsController],
  providers: [LocalFileStorage],
})
export class StorageServiceModule {}
