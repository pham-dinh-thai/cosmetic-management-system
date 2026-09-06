import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const imageUploadOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    _request: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ): void => {
    const looksLikeImage =
      /^image\/(jpe?g|png|webp|gif)$/.test(file.mimetype) ||
      /\.(jpe?g|png|webp|gif)$/i.test(file.originalname);

    if (looksLikeImage) {
      callback(null, true);
      return;
    }

    callback(new BadRequestException('Only image files are allowed'), false);
  },
} as const;
