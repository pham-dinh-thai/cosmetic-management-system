import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Audit, AuditAction, responseId } from '@app/audit-client';
import { CreatePaymentFromPurchaseUseCase } from 'apps/receipt-service/src/application/use-cases/create-payment-from-purchase/create-payment-from-purchase.use-case';
import { CreatePaymentFromPurchaseRequest } from './requests/internal-payment.request';

@Controller('internal/payments')
export class InternalPaymentsController {
  public constructor(
    private readonly createPaymentFromPurchaseUseCase: CreatePaymentFromPurchaseUseCase,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('from-purchase')
  @Audit({
    entityType: 'payment',
    action: AuditAction.CREATE,
    entityId: responseId(),
  })
  public async fromPurchase(
    @Body() request: CreatePaymentFromPurchaseRequest,
  ): Promise<{ id: string } | null> {
    const result = await this.createPaymentFromPurchaseUseCase.execute({
      purchaseOrderId: request.purchaseOrderId,
      supplierId: request.supplierId,
      amount: request.amount,
      employeeId: request.employeeId,
    });

    return result ? { id: result.id } : null;
  }
}