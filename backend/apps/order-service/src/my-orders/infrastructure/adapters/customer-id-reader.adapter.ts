import { ConfigService } from '@nestjs/config';
import { ICustomerIdReaderPort } from '../../application/ports/customer-id-reader.port';

type CustomerByUserData = {
  id?: string;
  code?: string;
};

export class CustomerIdReaderAdapter implements ICustomerIdReaderPort {
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('CUSTOMER_SERVICE_URL');
  }

  public async getCustomerIdByUserId(userId: string): Promise<string | null> {
    const response = await fetch(
      `${this.url}/api/internal/customers/by-user/${userId}`,
    );

    if (!response.ok) {
      return null;
    }

    const text = await response.text();

    if (!text) {
      return null;
    }

    const data = JSON.parse(text) as CustomerByUserData;

    return data.id?.trim() || null;
  }
}
