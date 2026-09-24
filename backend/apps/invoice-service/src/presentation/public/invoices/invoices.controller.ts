import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, PermissionsGuard, Permissions } from '@app/security';
import { Audit, AuditAction, paramId } from '@app/audit-client';
import { FindAllInvoicesUseCase } from 'apps/invoice-service/src/application/use-cases/find-all-invoices/find-all-invoices.use-case';
import { FindInvoiceByIdUseCase } from 'apps/invoice-service/src/application/use-cases/find-invoice-by-id/find-invoice-by-id.use-case';
import { RecordPaymentUseCase } from 'apps/invoice-service/src/application/use-cases/record-payment/record-payment.use-case';
import { UpdateInvoiceUseCase } from 'apps/invoice-service/src/application/use-cases/update-invoice/update-invoice.use-case';
import { DeleteInvoiceUseCase } from 'apps/invoice-service/src/application/use-cases/delete-invoice/delete-invoice.use-case';
import { InvoiceReadModel } from 'apps/invoice-service/src/application/use-cases/find-all-invoices/read-models/invoice.read-model';
import { InvoiceStatus } from 'apps/invoice-service/src/domain/types';
import {
  RecordPaymentRequest,
  UpdateInvoiceRequest,
} from './requests/invoice.requests';

@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('invoices:read')
@Controller('invoices')
export class InvoicesController {
  public constructor(
    private readonly findAllInvoicesUseCase: FindAllInvoicesUseCase,
    private readonly findInvoiceByIdUseCase: FindInvoiceByIdUseCase,
    private readonly recordPaymentUseCase: RecordPaymentUseCase,
    private readonly updateInvoiceUseCase: UpdateInvoiceUseCase,
    private readonly deleteInvoiceUseCase: DeleteInvoiceUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('search') search?: string,
    @Query('status') status?: InvoiceStatus,
    @Query('orderId') orderId?: string,
    @Query('customerId') customerId?: string,
  ): Promise<InvoiceReadModel[]> {
    return await this.findAllInvoicesUseCase.execute({
      search,
      status,
      orderId,
      customerId,
    });
  }

  @Get(':id')
  public async findById(@Param('id') id: string): Promise<InvoiceReadModel> {
    return await this.findInvoiceByIdUseCase.execute(id);
  }

  @Permissions('invoices:write')
  @HttpCode(HttpStatus.OK)
  @Put(':id/payment')
  @Audit({
    entityType: 'invoice',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async recordPayment(
    @Param('id') id: string,
    @Body() request: RecordPaymentRequest,
  ): Promise<InvoiceReadModel> {
    return await this.recordPaymentUseCase.execute(id, request.amount);
  }

  @Permissions('invoices:write')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  @Audit({
    entityType: 'invoice',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateInvoiceRequest,
  ): Promise<void> {
    await this.updateInvoiceUseCase.execute(id, request);
  }

  @Permissions('invoices:write')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Audit({
    entityType: 'invoice',
    action: AuditAction.DELETE,
    entityId: paramId(),
  })
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteInvoiceUseCase.execute(id);
  }
}
