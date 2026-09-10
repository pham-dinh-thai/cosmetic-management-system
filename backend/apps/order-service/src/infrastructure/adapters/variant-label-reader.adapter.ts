import { ConfigService } from '@nestjs/config';
import { IVariantLabelReaderPort } from '../../application/use-cases/print-order/ports/variant-label-reader.port';

type VariantLabelData = {
  id: string;
  name: string;
  cosmeticName: string;
};

export class VariantLabelReaderAdapter implements IVariantLabelReaderPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('COSMETIC_SERVICE_URL');
  }

  public async getVariantLabels(
    variantIds: string[],
  ): Promise<Record<string, string>> {
    if (variantIds.length === 0) {
      return {};
    }

    const response = await fetch(
      `${this.url}/api/internal/cosmetics/variants/batch?ids=${variantIds.join(',')}`,
    );

    if (!response.ok) {
      return {};
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      return {};
    }

    const labels: Record<string, string> = {};

    for (const item of data as VariantLabelData[]) {
      if (!item?.id || !item?.cosmeticName) {
        continue;
      }

      labels[item.id] = item.name
        ? `${item.cosmeticName} (${item.name})`
        : item.cosmeticName;
    }

    return labels;
  }
}