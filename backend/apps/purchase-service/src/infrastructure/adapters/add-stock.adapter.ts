import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAddStockPort } from '../../domain/ports/add-stock.port';

export class AddStockAdapter implements IAddStockPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('INVENTORY_SERVICE_URL');
  }

  public async execute(variantId: string, quantity: number): Promise<void> {
    const response = await fetch(
      `${this.url}/api/internal/inventory/purchase`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, quantity }),
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
  }
}
