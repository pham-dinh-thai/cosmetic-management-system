import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InsufficientStockException } from '../../domain/exceptions/insufficient-stock.exception';
import { IRemoveStockPort } from '../../domain/ports/remove-stock.port';

export class RemoveStockAdapter implements IRemoveStockPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('INVENTORY_SERVICE_URL');
  }

  public async execute(variantId: string, quantity: number): Promise<void> {
    const response = await fetch(`${this.url}/api/internal/inventory/sale`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId, quantity }),
    });

    if (response.ok) {
      return;
    }

    if (response.status === 409) {
      throw new InsufficientStockException(variantId, quantity, 0);
    }

    throw new InternalServerErrorException('Failed to remove stock');
  }
}
