import { Injectable } from '@nestjs/common';
import {
  ICreateCustomerPort,
  ICreateCustomerPortRequest,
} from '../../application/use-cases/register/ports/create-customer.port';
import { ConfigService } from '@nestjs/config';
import { HttpClient, HttpResponseError } from '@nestjs/http-client';

@Injectable()
export class CreateCustomerAdapter implements ICreateCustomerPort {
  public constructor(
    private readonly config: ConfigService,
    private readonly httpClient: HttpClient,
  ) {}

  public async execute(
    request: ICreateCustomerPortRequest,
  ): Promise<{ id: string }> {
    const url = this.config.get<string>('CUSTOMER_SERVICE_URL');

    if (!url) {
      throw new Error('CUSTOMER_SERVICE_URL is not configured');
    }

    try {
      const { data } = await this.httpClient.post<{ id: string }>(
        `${url}/api/internal/customers`,
        {
          json: request,
        },
      );

      return data;
    } catch (error) {
      if (error instanceof HttpResponseError) {
        throw new Error(
          `Failed to create customer: ${error.status} ${error.statusText}`,
          { cause: error },
        );
      }

      throw error;
    }
  }
}
