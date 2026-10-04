import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDeleteCustomerPort } from '../../application/use-cases/register/ports/delete-customer.port';
import { HttpClient, HttpResponseError } from '@nestjs/http-client';

@Injectable()
export class DeleteCustomerAdapter implements IDeleteCustomerPort {
  public constructor(
    private readonly config: ConfigService,
    private readonly httpClient: HttpClient,
  ) {}

  public async execute(customerId: string): Promise<boolean> {
    const url = this.config.get<string>('CUSTOMER_SERVICE_URL');

    if (!url) {
      throw new Error('CUSTOMER_SERVICE_URL is not configured');
    }

    try {
      await this.httpClient.delete(
        `${url}/api/internal/customers/${customerId}`,
      );

      return true;
    } catch (error) {
      if (error instanceof HttpResponseError) {
        // Đã bị xoá trước đó: coi như thành công, giữ hành vi của bản fetch.
        if (error.status === 404) {
          return true;
        }

        throw new Error(
          `Failed to delete customer: ${error.status} ${error.statusText}`,
          { cause: error },
        );
      }

      throw error;
    }
  }
}
