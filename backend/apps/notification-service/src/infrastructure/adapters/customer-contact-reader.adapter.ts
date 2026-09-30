import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CustomerContact,
  ICustomerContactReaderPort,
} from '../../application/ports/customer-contact-reader.port';

type CustomerResponse = {
  email?: string;
  name?: string;
};

export class CustomerContactReaderAdapter implements ICustomerContactReaderPort {
  private readonly url: string;
  private readonly logger = new Logger(CustomerContactReaderAdapter.name);

  public constructor(config: ConfigService) {
    this.url = config.getOrThrow<string>('CUSTOMER_SERVICE_URL');
  }

  public async getContact(customerId: string): Promise<CustomerContact | null> {
    const response = await fetch(
      `${this.url}/api/internal/customers/${customerId}`,
      { signal: AbortSignal.timeout(5000) },
    );

    if (!response.ok) {
      return null;
    }

    const text = await response.text();

    if (!text) {
      return null;
    }

    const data = JSON.parse(text) as CustomerResponse;
    const email = data.email?.trim();

    if (!email) {
      this.logger.warn(`Khach ${customerId} khong co email, bo qua`);
      return null;
    }

    return { email, name: data.name?.trim() ?? '' };
  }
}
