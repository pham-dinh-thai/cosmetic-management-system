import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '@app/redis-client';
import { ICustomerNameReaderPort } from '../../application/ports/customer-name-reader.port';

type CustomerData = {
  id?: string;
  name?: string;
};

const CACHE_KEY_PREFIX = 'order:customer-name:';
const CACHE_TTL_SECONDS = 3600;

export class CustomerNameReaderAdapter implements ICustomerNameReaderPort {
  private readonly url: string;

  public constructor(
    private readonly config: ConfigService,

    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {
    this.url = this.config.getOrThrow<string>('CUSTOMER_SERVICE_URL');
  }

  public async getCustomerName(customerId: string): Promise<string | null> {
    const cacheKey = `${CACHE_KEY_PREFIX}${customerId}`;

    try {
      const cached = await this.redis.get(cacheKey);

      if (cached) {
        return cached;
      }
    } catch (error) {
      Logger.warn(error);
    }

    const customerName = await this.fetchFromCustomerService(customerId);

    if (customerName) {
      try {
        await this.redis.set(cacheKey, customerName, 'EX', CACHE_TTL_SECONDS);
      } catch (error) {
        Logger.warn(error);
      }
    }

    return customerName;
  }

  private async fetchFromCustomerService(
    customerId: string,
  ): Promise<string | null> {
    const response = await fetch(
      `${this.url}/api/internal/customers/${customerId}`,
    );

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
