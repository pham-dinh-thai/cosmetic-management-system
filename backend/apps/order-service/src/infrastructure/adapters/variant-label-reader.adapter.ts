import { ConfigService } from '@nestjs/config';
import {
  IVariantLabelReaderPort,
  VariantLabelData,
} from '../../application/use-cases/print-order/ports/variant-label-reader.port';

type VariantLabelResponseData = {
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
    const data = await this.fetchVariantData(variantIds);

    const labels: Record<string, string> = {};

    for (const item of data) {
      if (!item?.id || !item?.cosmeticName) {
        continue;
      }

      labels[item.id] = item.name
        ? `${item.cosmeticName} (${item.name})`
        : item.cosmeticName;
    }

    return labels;
  }

  public async getVariantData(
    variantIds: string[],
  ): Promise<Record<string, VariantLabelData>> {
    const data = await this.fetchVariantData(variantIds);

    const result: Record<string, VariantLabelData> = {};

    for (const item of data) {
      if (!item?.id || !item?.cosmeticName) {
        continue;
      }

      result[item.id] = {
        cosmeticName: item.cosmeticName,
        variantName: item.name?.trim() || null,
      };
    }

    return result;
  }

  private async fetchVariantData(
    variantIds: string[],
  ): Promise<VariantLabelResponseData[]> {
    if (variantIds.length === 0) {
      return [];
    }

    const response = await fetch(
      `${this.url}/api/internal/cosmetics/variants/batch?ids=${variantIds.join(',')}`,
    );

    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    const variants = data as VariantLabelResponseData[];

    return variants.filter(
      (item) => item && typeof item.id === 'string' && item.id.length > 0,
    );
  }
}
