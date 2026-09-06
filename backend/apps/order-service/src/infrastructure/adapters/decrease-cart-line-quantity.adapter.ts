import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDecreaseCartLineQuantityPort } from '../../application/use-cases/place-order/ports/decrease-cart-line-quantity.port';

export class DecreaseCartLineQuantityAdapter
  implements IDecreaseCartLineQuantityPort
{
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('BASKET_SERVICE_URL');
  }

  public async execute(
    customerId: string,
    lines: { variantId: string; quantity: number }[],
  ): Promise<void> {
    const response = await fetch(
      `${this.url}/api/internal/carts/${customerId}/items/remove`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines }),
      },
    );

    if (!response.ok) {
      throw new InternalServerErrorException(
        'Failed to decrease cart line quantity',
      );
    }
  }
}