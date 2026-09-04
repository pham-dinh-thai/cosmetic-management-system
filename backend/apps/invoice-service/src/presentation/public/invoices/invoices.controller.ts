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
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
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

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
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

  @HttpCode(HttpStatus.OK)
  @Put(':id/payment')
  public async recordPayment(
    @Param('id') id: string,
    @Body() request: RecordPaymentRequest,
  ): Promise<InvoiceReadModel> {
    return await this.recordPaymentUseCase.execute(id, request.amount);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateInvoiceRequest,
  ): Promise<void> {
    await this.updateInvoiceUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteInvoiceUseCase.execute(id);
  }
}
