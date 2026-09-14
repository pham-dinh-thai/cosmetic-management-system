import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAddStockPort, StockOperationResult } from '../../domain/ports/add-stock.port';

export class AddStockAdapter implements IAddStockPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('INVENTORY_SERVICE_URL');
  }

  public async execute(
    variantId: string,
    quantity: number,
    supplierId: string,
    expiredDate: Date,
    createdBy?: string,
  ): Promise<StockOperationResult> {
    const response = await fetch(
      `${this.url}/api/internal/inventories/purchase`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          quantity,
          supplierId,
          expiredDate: expiredDate.toISOString().slice(0, 10),
          ...(createdBy ? { createdBy } : {}),
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => '');

      if (response.status >= 400 && response.status < 500) {
        throw new BadRequestException(
          `Failed to add stock${body ? ` - ${body}` : ''}`,
        );
      }

      throw new InternalServerErrorException('Failed to add stock');
    }

    const result = (await response.json()) as {
      lotNumber: string;
      quantity: number;
      variantId: string;
    };

    return { batchId: result.lotNumber };
  }

  public async reverse(
    variantId: string,
    deductions: { batchId: string; quantity: number }[],
  ): Promise<void> {
    const response = await fetch(
      `${this.url}/api/internal/inventories/reverse`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          quantity: deductions.reduce((sum, d) => sum + d.quantity, 0),
          deductions,
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => '');

      if (response.status >= 400 && response.status < 500) {
        throw new BadRequestException(
          `Failed to reverse stock${body ? ` - ${body}` : ''}`,
        );
      }

      throw new InternalServerErrorException('Failed to reverse stock');
    }
  }
}