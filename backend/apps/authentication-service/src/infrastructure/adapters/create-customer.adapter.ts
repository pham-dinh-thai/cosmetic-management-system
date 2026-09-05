import { Injectable } from '@nestjs/common';
import {
  ICreateCustomerPort,
  ICreateCustomerPortRequest,
} from '../../application/ports/create-customer.port';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateCustomerAdapter implements ICreateCustomerPort {
  public constructor(private readonly config: ConfigService) {}

  public async execute(
    request: ICreateCustomerPortRequest,
  ): Promise<{ id: string }> {
    const url = this.config.get<string>('CUSTOMER_SERVICE_URL');

    if (!url) {
      throw new Error('CUSTOMER_SERVICE_URL is not configured');
    }

    const response = await fetch(`${url}/api/internal/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Failed to create customer: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    return (await response.json()) as { id: string };
  }
}
