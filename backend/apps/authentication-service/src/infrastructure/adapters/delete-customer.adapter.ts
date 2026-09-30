import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDeleteCustomerPort } from '../../application/use-cases/register/ports/delete-customer.port';

@Injectable()
export class DeleteCustomerAdapter implements IDeleteCustomerPort {
  public constructor(private readonly config: ConfigService) {}

  public async execute(customerId: string): Promise<boolean> {
    const url = this.config.get<string>('CUSTOMER_SERVICE_URL');

    if (!url) {
      throw new Error('CUSTOMER_SERVICE_URL is not configured');
    }

    const response = await fetch(
      `${url}/api/internal/customers/${customerId}`,
      { method: 'DELETE' },
    );

    if (!response.ok && response.status !== 404) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Failed to delete customer: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    return true;
  }
}
