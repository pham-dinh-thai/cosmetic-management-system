import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { isImageByMagicBytes } from './image-magic-bytes';

const ALLOWED_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif)$/;

@Injectable()
export class LocalFileStorage {
  private readonly uploadRoot: string;

  public constructor(config: ConfigService) {
    this.uploadRoot = config.get<string>('UPLOAD_ROOT') ?? './uploads';
  }

  public save(file: Express.Multer.File, folder: string): string {
    const extension = extname(file.originalname).toLowerCase();

    if (!ALLOWED_IMAGE_EXTENSIONS.test(extension)) {
      throw new BadRequestException(
        `Unsupported image type "${extension}" (jpg, png, webp, gif only)`,
      );
    }

    if (!isImageByMagicBytes(file.buffer)) {
      throw new BadRequestException(
        'File content is not a valid image (jpg, png, webp, gif only)',
      );
    }

    const filename = `${randomBytes(16).toString('hex')}${extension}`;
    const directory = join(this.uploadRoot, folder);

    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, filename), file.buffer);

    return `/api/uploads/${folder}/${filename}`;
  }
}
