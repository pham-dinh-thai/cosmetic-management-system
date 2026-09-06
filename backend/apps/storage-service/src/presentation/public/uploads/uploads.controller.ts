import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalFileStorage } from '../../../infrastructure/storage/local-file-storage';
import { imageUploadOptions } from '../../../infrastructure/storage/upload-options';

@Controller('uploads')
export class UploadsController {
  public constructor(private readonly imageStorage: LocalFileStorage) {}

  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  @Post()
  public uploadImage(@UploadedFile() image: Express.Multer.File | undefined): {
    imageUrl: string;
  } {
    if (!image) {
      throw new BadRequestException(
        'No image file uploaded in the "image" field',
      );
    }

    return { imageUrl: this.imageStorage.save(image, 'cosmetics') };
  }
}
