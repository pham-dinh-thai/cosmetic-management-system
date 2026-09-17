import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreatePaymentInput,
  ICreatePaymentPort,
} from '../../domain/ports/create-payment.port';

export class CreatePaymentAdapter implements ICreatePaymentPort {
  private readonly logger = new Logger(CreatePaymentAdapter.name);
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('RECEIPT_SERVICE_URL');
  }

  public async execute(input: CreatePaymentInput): Promise<void> {
    const response = await fetch(
      `${this.url}/api/internal/payments/from-purchase`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      },
    );

    if (!response.ok) {
      this.logger.error(
        `Failed to create payment for purchase order ${input.purchaseOrderId} (status ${response.status})`,
      );
      throw new InternalServerErrorException(
        'Không thể tạo phiếu chi cho phiếu nhập',
      );
    }
  }
}