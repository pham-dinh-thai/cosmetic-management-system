import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '@app/redis-client';
import {
  CustomerLabel,
  ICustomerNameReaderPort,
} from '../../application/ports/customer-name-reader.port';

type CustomerData = {
  code?: string;
  name?: string;
};

const CACHE_KEY_PREFIX = 'order:customer-label:';
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
    const label = await this.getCustomerLabel(customerId);

    return label?.name ?? null;
  }

  public async getCustomerLabel(
    customerId: string,
  ): Promise<CustomerLabel | null> {
    const cacheKey = `${CACHE_KEY_PREFIX}${customerId}`;

    try {
      const cached = await this.redis.get(cacheKey);

      if (cached) {
        return this.parseLabel(cached);
      }
    } catch (error) {
      Logger.warn(error);
    }

    const label = await this.fetchFromCustomerService(customerId);

    if (label) {
      try {
        await this.redis.set(
          cacheKey,
          JSON.stringify(label),
          'EX',
          CACHE_TTL_SECONDS,
        );
      } catch (error) {
        Logger.warn(error);
      }
    }

    return label;
  }

  private parseLabel(cached: string): CustomerLabel | null {
    try {
      const parsed = JSON.parse(cached) as Partial<CustomerLabel>;

      if (typeof parsed.name === 'string' && parsed.name.length > 0) {
        return {
          code: typeof parsed.code === 'string' ? parsed.code : '',
          name: parsed.name,
        };
      }
    } catch (error) {
      Logger.warn(error);
    }

    return null;
  }

  private async fetchFromCustomerService(
    customerId: string,
  ): Promise<CustomerLabel | null> {
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
    const name = data.name?.trim();

    if (!name) {
      return null;
    }

    return { code: data.code?.trim() ?? '', name };
  }
}
