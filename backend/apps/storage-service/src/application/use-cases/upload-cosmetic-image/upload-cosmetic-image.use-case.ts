import { BadRequestException } from '@nestjs/common';
import { LocalFileStorage } from '../../../infrastructure/storage/local-file-storage';

export class UploadCosmeticImageUseCase {
  public constructor(private readonly imageStorage: LocalFileStorage) {}

  public execute(image: Express.Multer.File | undefined): {
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

export const uploadCosmeticImageUseCaseFactory = (
  imageStorage: LocalFileStorage,
): UploadCosmeticImageUseCase => new UploadCosmeticImageUseCase(imageStorage);
