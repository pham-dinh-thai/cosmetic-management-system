import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ICreateCustomerPhonePort,
  ICreateCustomerPhonePortRequest,
} from '../../application/use-cases/register/ports/create-customer.port';
import { CustomerContactRejectedException } from '../../domain/exceptions/customer-contact-rejected.exception';

@Injectable()
export class CreateCustomerPhoneAdapter implements ICreateCustomerPhonePort {
  public constructor(private readonly config: ConfigService) {}

  public async execute(
    request: ICreateCustomerPhonePortRequest,
  ): Promise<void> {
    const url = this.config.get<string>('CUSTOMER_SERVICE_URL');

    if (!url) {
      throw new Error('CUSTOMER_SERVICE_URL is not configured');
    }

    const response = await fetch(
      `${url}/api/internal/customers/${request.customerId}/phones`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: request.phone }),
      },
    );

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        statusCode?: number;
        message?: string | string[];
      } | null;

      const message = Array.isArray(body?.message)
        ? body?.message.join(', ')
        : (body?.message ?? `${response.status} ${response.statusText}`);

      throw new CustomerContactRejectedException(
        body?.statusCode ?? response.status,
        message,
      );
    }
  }
}
