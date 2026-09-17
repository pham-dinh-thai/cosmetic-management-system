import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateInvoiceFromOrderUseCase } from 'apps/invoice-service/src/application/use-cases/create-invoice-from-order/create-invoice-from-order.use-case';
import { CreateInvoiceFromOrderRequest } from './requests/internal-invoice.request';

@Controller('internal/invoices')
export class InternalInvoicesController {
  public constructor(
    private readonly createInvoiceFromOrderUseCase: CreateInvoiceFromOrderUseCase,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('from-order')
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
}