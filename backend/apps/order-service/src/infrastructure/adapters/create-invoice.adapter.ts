import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateInvoiceInput,
  ICreateInvoicePort,
} from '../../domain/ports/create-invoice.port';

export class CreateInvoiceAdapter implements ICreateInvoicePort {
  private readonly logger = new Logger(CreateInvoiceAdapter.name);
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('INVOICE_SERVICE_URL');
  }

  public async execute(input: CreateInvoiceInput): Promise<void> {
    const response = await fetch(
      `${this.url}/api/internal/invoices/from-order`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      },
    );

    if (!response.ok) {
      this.logger.error(
        `Failed to create invoice for order ${input.orderId} (status ${response.status})`,
      );
      throw new InternalServerErrorException(
        'Không thể tạo hóa đơn cho đơn hàng',
      );
    }
  }
}
