import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Audit, AuditAction, responseId } from '@app/audit-client';
import { CreateInvoiceFromOrderUseCase } from 'apps/invoice-service/src/application/use-cases/create-invoice-from-order/create-invoice-from-order.use-case';
import { FinalizeInvoiceFromOrderUseCase } from 'apps/invoice-service/src/application/use-cases/finalize-invoice-from-order/finalize-invoice-from-order.use-case';
import {
  CreateInvoiceFromOrderRequest,
  FinalizeInvoiceFromOrderRequest,
} from './requests/internal-invoice.request';

@Controller('internal/invoices')
export class InternalInvoicesController {
  public constructor(
    private readonly createInvoiceFromOrderUseCase: CreateInvoiceFromOrderUseCase,
    private readonly finalizeInvoiceFromOrderUseCase: FinalizeInvoiceFromOrderUseCase,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('from-order')
  @Audit({
    entityType: 'invoice',
    action: AuditAction.CREATE,
    entityId: responseId(),
  })
  public async fromOrder(
    @Body() request: CreateInvoiceFromOrderRequest,
  ): Promise<{ id: string } | null> {
    return await this.createInvoiceFromOrderUseCase.execute({
      orderId: request.orderId,
      code: request.code,
      customerId: request.customerId,
      totalAmount: request.totalAmount,
      paid: request.paid,
      employeeId: request.employeeId,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('finalize-from-order')
  public async finalizeFromOrder(
    @Body() request: FinalizeInvoiceFromOrderRequest,
  ): Promise<{ id: string } | null> {
    return await this.finalizeInvoiceFromOrderUseCase.execute({
      orderId: request.orderId,
      employeeId: request.employeeId,
    });
  }
}