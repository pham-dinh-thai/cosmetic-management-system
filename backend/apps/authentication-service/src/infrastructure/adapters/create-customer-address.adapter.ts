import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ICreateCustomerAddressPort,
  ICreateCustomerAddressPortRequest,
} from '../../application/use-cases/register/ports/create-customer.port';
import { CustomerContactRejectedException } from '../../domain/exceptions/customer-contact-rejected.exception';
import { HttpClient, HttpResponseError } from '@nestjs/http-client';

@Injectable()
export class CreateCustomerAddressAdapter implements ICreateCustomerAddressPort {
  public constructor(
    private readonly config: ConfigService,
    private readonly httpClient: HttpClient,
  ) {}

  public async execute(
    request: ICreateCustomerAddressPortRequest,
  ): Promise<void> {
    const url = this.config.get<string>('CUSTOMER_SERVICE_URL');

    if (!url) {
      throw new Error('CUSTOMER_SERVICE_URL is not configured');
    }

    try {
      await this.httpClient.post(
        `${url}/api/internal/customers/${request.customerId}/addresses`,
        {
          // `city` phải có mặt: AddAddressRequest validate @IsString() nên
          // thiếu field sẽ bị ValidationPipe chặn 400.
          json: { city: '', street: request.street },
        },
      );
    } catch (error) {
      if (error instanceof HttpResponseError) {
        const body = error.body as {
          message?: string | string[];
        } | null;

        const message = Array.isArray(body?.message)
          ? body.message.join(', ')
          : (body?.message ?? `${error.status} ${error.statusText}`);

        throw new CustomerContactRejectedException(error.status, message);
      }

      throw error;
    }
  }
}
