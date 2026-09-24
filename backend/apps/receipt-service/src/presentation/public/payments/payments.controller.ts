import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, PermissionsGuard, Permissions } from '@app/security';
import { Audit, AuditAction, paramId, responseId } from '@app/audit-client';
import { CreateManualPaymentUseCase } from 'apps/receipt-service/src/application/use-cases/create-manual-payment/create-manual-payment.use-case';
import { FindAllPaymentsUseCase } from 'apps/receipt-service/src/application/use-cases/find-all-payments/find-all-payments.use-case';
import { FindPaymentByIdUseCase } from 'apps/receipt-service/src/application/use-cases/find-payment-by-id/find-payment-by-id.use-case';
import { UpdatePaymentNoteUseCase } from 'apps/receipt-service/src/application/use-cases/update-payment/update-payment.use-case';
import { DeletePaymentUseCase } from 'apps/receipt-service/src/application/use-cases/delete-payment/delete-payment.use-case';
import { PaymentReadModel } from 'apps/receipt-service/src/application/use-cases/find-all-payments/read-models/payment.read-model';
import {
  CreatePaymentRequest,
  FindAllPaymentsQuery,
  UpdatePaymentRequest,
} from './requests/payment.requests';

@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('payments:read')
@Controller('payments')
export class PaymentsController {
  public constructor(
    private readonly createManualPaymentUseCase: CreateManualPaymentUseCase,
    private readonly findAllPaymentsUseCase: FindAllPaymentsUseCase,
    private readonly findPaymentByIdUseCase: FindPaymentByIdUseCase,
    private readonly updatePaymentNoteUseCase: UpdatePaymentNoteUseCase,
    private readonly deletePaymentUseCase: DeletePaymentUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query() query: FindAllPaymentsQuery,
  ): Promise<PaymentReadModel[]> {
    return await this.findAllPaymentsUseCase.execute({
      search: query.search,
      category: query.category,
      source: query.source,
      purchaseOrderId: query.purchaseOrderId,
      supplierId: query.supplierId,
      fromDate: query.fromDate,
      toDate: query.toDate,
    });
  }

  @Get(':id')
  public async findById(@Param('id') id: string): Promise<PaymentReadModel> {
    return await this.findPaymentByIdUseCase.execute(id);
  }

  @Permissions('payments:write')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Audit({
    entityType: 'payment',
    action: AuditAction.CREATE,
    entityId: responseId(),
  })
  public async create(
    @Body() request: CreatePaymentRequest,
  ): Promise<{ id: string; code: string }> {
    const result = await this.createManualPaymentUseCase.execute({
      amount: request.amount,
      category: request.category,
      supplierId: request.supplierId,
      note: request.note,
    });

    const payment = await this.findPaymentByIdUseCase.execute(result.id);

    return { id: result.id, code: payment.code };
  }

  @Permissions('payments:write')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  @Audit({
    entityType: 'payment',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async update(
    @Param('id') id: string,
    @Body() request: UpdatePaymentRequest,
  ): Promise<void> {
    await this.updatePaymentNoteUseCase.execute(id, request.note);
  }

  @Permissions('payments:write')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Audit({
    entityType: 'payment',
    action: AuditAction.DELETE,
    entityId: paramId(),
  })
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deletePaymentUseCase.execute(id);
  }
}