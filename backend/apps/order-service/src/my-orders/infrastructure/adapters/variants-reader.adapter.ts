import { ConfigService } from '@nestjs/config';
import { VariantNotFoundException } from '../../../shared/domain/exceptions/variant-not-found.exception';
import { IVariantsReaderPort } from '../../application/ports/variants-reader.port';

export class VariantsReaderAdapter implements IVariantsReaderPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('COSMETIC_SERVICE_URL');
  }

  public async findVariantUnitPrice(variantId: string): Promise<number> {
    const response = await fetch(
      `${this.url}/api/internal/cosmetics/variants/${variantId}`,
    );

    if (!response.ok) {
      throw new VariantNotFoundException(variantId);
    }

    const text = await response.text();

    if (!text) {
      throw new VariantNotFoundException(variantId);
    }

    const variant: unknown = JSON.parse(text);

    const price = (variant as { price?: unknown })?.price;

    if (typeof price !== 'number') {
      throw new VariantNotFoundException(variantId);
    }

    return price;
  }
}
