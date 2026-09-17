import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateReceiptInput,
  ICreateReceiptPort,
} from '../../domain/ports/create-receipt.port';

export class CreateReceiptAdapter implements ICreateReceiptPort {
  private readonly logger = new Logger(CreateReceiptAdapter.name);
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('RECEIPT_SERVICE_URL');
  }

  public async execute(input: CreateReceiptInput): Promise<void> {
    const response = await fetch(
      `${this.url}/api/internal/receipts/from-invoice-payment`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      },
    );

    if (!response.ok) {
      this.logger.error(
        `Failed to create receipt for invoice ${input.invoiceId} (status ${response.status})`,
      );
      throw new InternalServerErrorException(
        'Không thể tạo phiếu thu cho hóa đơn',
      );
    }
  }
}