import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IVariantReaderPort,
  VariantReadModel,
} from '../../application/ports/variant-reader.port';

@Injectable()
export class VariantReaderAdapter implements IVariantReaderPort {
  public constructor(private readonly config: ConfigService) {}

  public async findById(id: string): Promise<VariantReadModel | null> {
    const url = this.config.get<string>('COSMETIC_SERVICE_URL');

    if (!url) {
      throw new Error('COSMETIC_SERVICE_URL is not configured');
    }

    const response = await fetch(
      `${url}/api/internal/cosmetics/variants/${id}`,
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Cosmetic service returned ${response.status}: ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    const text = await response.text();

    return text ? (JSON.parse(text) as VariantReadModel) : null;
  }
}
