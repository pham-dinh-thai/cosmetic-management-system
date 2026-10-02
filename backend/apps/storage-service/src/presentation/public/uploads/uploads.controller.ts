import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard, Permissions, PermissionsGuard } from '@app/security';
import { UploadCosmeticImageUseCase } from '../../../application/use-cases/upload-cosmetic-image/upload-cosmetic-image.use-case';
import { imageUploadOptions } from '../../../infrastructure/storage/upload-options';

@Controller('uploads')
export class UploadsController {
  public constructor(
    private readonly uploadCosmeticImageUseCase: UploadCosmeticImageUseCase,
  ) {}

  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('cosmetics:write')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  @Post()
  public uploadImage(@UploadedFile() image: Express.Multer.File | undefined): {
    imageUrl: string;
  } {
    return this.uploadCosmeticImageUseCase.execute(image);
  }
}
