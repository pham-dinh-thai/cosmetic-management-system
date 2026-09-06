import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IReverseInventoryPort } from '../../application/use-cases/place-order/ports/reverse-inventory.port';

export class ReverseInventoryAdapter implements IReverseInventoryPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('INVENTORY_SERVICE_URL');
  }

  public async execute(variantId: string, quantity: number): Promise<void> {
    const response = await fetch(`${this.url}/api/internal/inventory/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId, quantity }),
    });

    if (!response.ok) {
      throw new InternalServerErrorException('Failed to reverse inventory');
    }
  }
}