import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICreateOrderPort } from '../../application/ports/create-order.port';

@Injectable()
export class CreateOrderAdapter implements ICreateOrderPort {
  public constructor(private readonly config: ConfigService) {}

  public async execute(request: {
    customerId: string;
    lines: { variantId: string; quantity: number; unitPrice: number }[];
  }): Promise<{ id: string }> {
    const url = this.config.get<string>('ORDER_SERVICE_URL');

    if (!url) {
      throw new Error('ORDER_SERVICE_URL is not configured');
    }

    const response = await fetch(`${url}/api/internal/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Failed to create order: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    return (await response.json()) as { id: string };
  }
}
