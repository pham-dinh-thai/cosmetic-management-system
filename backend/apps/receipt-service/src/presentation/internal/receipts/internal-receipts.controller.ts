import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Audit, AuditAction, responseId } from '@app/audit-client';
import { CreateReceiptFromInvoicePaymentUseCase } from 'apps/receipt-service/src/application/use-cases/create-receipt-from-invoice-payment/create-receipt-from-invoice-payment.use-case';
import { CreateReceiptFromInvoicePaymentRequest } from './requests/internal-receipt.request';

@Controller('internal/receipts')
export class InternalReceiptsController {
  public constructor(
    private readonly createReceiptFromInvoicePaymentUseCase: CreateReceiptFromInvoicePaymentUseCase,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('from-invoice-payment')
  @Audit({
    entityType: 'receipt',
    action: AuditAction.CREATE,
    entityId: responseId(),
  })
  public async fromInvoicePayment(
    @Body() request: CreateReceiptFromInvoicePaymentRequest,
  ): Promise<{ id: string } | null> {
    const result = await this.createReceiptFromInvoicePaymentUseCase.execute({
      invoiceId: request.invoiceId,
      customerId: request.customerId,
      amount: request.amount,
      note: request.note,
      employeeId: request.employeeId,
    });

    return result
      ? { id: result.id }
      : null;
  }
}