import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FinalizeInvoiceInput,
  IFinalizeInvoicePort,
} from '../../application/ports/finalize-invoice.port';

export class FinalizeInvoiceAdapter implements IFinalizeInvoicePort {
  private readonly logger = new Logger(FinalizeInvoiceAdapter.name);
  private readonly url: string;

  public constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('INVOICE_SERVICE_URL');
  }

  public async execute(input: FinalizeInvoiceInput): Promise<void> {
    const response = await fetch(
      `${this.url}/api/internal/invoices/finalize-from-order`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      },
    );

    if (!response.ok) {
      this.logger.error(
        `Failed to finalize invoice for order ${input.orderId} (status ${response.status})`,
      );
      throw new InternalServerErrorException(
        'Không thể chốt thanh toán cho đơn hàng',
      );
    }
  }
}
