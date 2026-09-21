import { ConfigService } from '@nestjs/config';
import { ICustomerNameReaderPort } from '../../domain/ports/customer-name-reader.port';

type CustomerData = {
  id?: string;
  name?: string;
};

export class CustomerNameReaderAdapter implements ICustomerNameReaderPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('CUSTOMER_SERVICE_URL');
  }

  public async getCustomerName(customerId: string): Promise<string | null> {
    const response = await fetch(`${this.url}/api/internal/customers/${customerId}`);

    if (!response.ok) {
      return null;
    }

    const text = await response.text();

    if (!text) {
      return null;
    }

    const data = JSON.parse(text) as CustomerData;

    return data.name?.trim() || null;
  }
}