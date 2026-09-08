import { ConfigService } from '@nestjs/config';

export interface VariantStock {
  quantity: number;
  minStock: number;
}

export interface IStockReaderPort {
  getStocks(variantIds: string[]): Promise<Record<string, VariantStock>>;
}

export const STOCK_READER_PORT = 'IStockReaderPort';

export class StockReaderAdapter implements IStockReaderPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('INVENTORY_SERVICE_URL');
  }

  public async getStocks(
    variantIds: string[],
  ): Promise<Record<string, VariantStock>> {
    if (variantIds.length === 0) {
      return {};
    }

    const stocks: Record<string, VariantStock> = {};

    await Promise.all(
      variantIds.map(async (variantId) => {
        try {
          const response = await fetch(
            `${this.url}/api/inventory/by-variant/${variantId}`,
          );

          if (!response.ok) {
            return;
          }

          const text = await response.text();

          if (!text) {
            return;
          }

          const body = JSON.parse(text) as {
            quantity?: unknown;
            minStock?: unknown;
          };

          if (typeof body.quantity === 'number') {
            stocks[variantId] = {
              quantity: body.quantity,
              minStock:
                typeof body.minStock === 'number' ? body.minStock : 0,
            };
          }
        } catch {
          // ignore per-variant failures; treat as no stock data
        }
      }),
    );

    return stocks;
  }
}
