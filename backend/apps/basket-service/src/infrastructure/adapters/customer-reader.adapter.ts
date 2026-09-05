import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICustomerReaderPort } from '../../application/ports/customer-reader.port';

@Injectable()
export class CustomerReaderAdapter implements ICustomerReaderPort {
  public constructor(private readonly config: ConfigService) {}

  public async findByUserId(userId: string): Promise<{ id: string } | null> {
    const url = this.config.get<string>('CUSTOMER_SERVICE_URL');

    if (!url) {
      throw new Error('CUSTOMER_SERVICE_URL is not configured');
    }

    const response = await fetch(
      `${url}/api/internal/customers/by-user/${userId}`,
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Customer service returned ${response.status}: ${response.statusText}${body ? ` - ${body}` : ''}`,
      );
    }

    const text = await response.text();

    return text ? (JSON.parse(text) as { id: string }) : null;
  }
}
