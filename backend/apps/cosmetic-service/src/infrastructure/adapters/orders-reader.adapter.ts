import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

export interface IOrdersReaderPort {
  findVariantIdsWithOrders(variantIds: string[]): Promise<string[]>;
}

export const ORDERS_READER_PORT = 'IOrdersReaderPort';

@Injectable()
export class OrdersReaderAdapter implements IOrdersReaderPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('ORDER_SERVICE_URL');
  }

  public async findVariantIdsWithOrders(
    variantIds: string[],
  ): Promise<string[]> {
    if (variantIds.length === 0) {
      return [];
    }

    try {
      const response = await fetch(`${this.url}/api/internal/orders/variants-in-use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantIds }),
      });

      if (!response.ok) {
        return [];
      }

      const body = (await response.json()) as { variantIds?: unknown };

      if (!Array.isArray(body.variantIds)) {
        return [];
      }

      return body.variantIds
        .filter((v): v is string => typeof v === 'string');
    } catch {
      return [];
    }
  }
}
