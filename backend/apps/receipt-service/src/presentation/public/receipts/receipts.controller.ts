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
import { AuthGuard, Departments, OrgGuard, Role, Roles } from '@app/security';
import { Audit, AuditAction, paramId, responseId } from '@app/audit-client';
import { CreateManualReceiptUseCase } from 'apps/receipt-service/src/application/use-cases/create-manual-receipt/create-manual-receipt.use-case';
import { FindAllReceiptsUseCase } from 'apps/receipt-service/src/application/use-cases/find-all-receipts/find-all-receipts.use-case';
import { FindReceiptByIdUseCase } from 'apps/receipt-service/src/application/use-cases/find-receipt-by-id/find-receipt-by-id.use-case';
import { UpdateReceiptNoteUseCase } from 'apps/receipt-service/src/application/use-cases/update-receipt/update-receipt.use-case';
import { DeleteReceiptUseCase } from 'apps/receipt-service/src/application/use-cases/delete-receipt/delete-receipt.use-case';
import { ReceiptReadModel } from 'apps/receipt-service/src/application/use-cases/find-all-receipts/read-models/receipt.read-model';
import {
  CreateReceiptRequest,
  FindAllReceiptsQuery,
  UpdateReceiptRequest,
} from './requests/receipt.requests';

@UseGuards(AuthGuard, OrgGuard)
@Roles(Role.Admin, Role.Employee)
@Departments('accounting', 'accountant')
@Controller('receipts')
export class ReceiptsController {
  public constructor(
    private readonly createManualReceiptUseCase: CreateManualReceiptUseCase,
    private readonly findAllReceiptsUseCase: FindAllReceiptsUseCase,
    private readonly findReceiptByIdUseCase: FindReceiptByIdUseCase,
    private readonly updateReceiptNoteUseCase: UpdateReceiptNoteUseCase,
    private readonly deleteReceiptUseCase: DeleteReceiptUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query() query: FindAllReceiptsQuery,
  ): Promise<ReceiptReadModel[]> {
    return await this.findAllReceiptsUseCase.execute({
      search: query.search,
      source: query.source,
      invoiceId: query.invoiceId,
      customerId: query.customerId,
      fromDate: query.fromDate,
      toDate: query.toDate,
    });
  }

  @Get(':id')
  public async findById(@Param('id') id: string): Promise<ReceiptReadModel> {
    return await this.findReceiptByIdUseCase.execute(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Audit({
    entityType: 'receipt',
    action: AuditAction.CREATE,
    entityId: responseId(),
  })
  public async create(
    @Body() request: CreateReceiptRequest,
  ): Promise<{ id: string; code: string }> {
    const result = await this.createManualReceiptUseCase.execute({
      amount: request.amount,
      invoiceId: request.invoiceId,
      customerId: request.customerId,
      note: request.note,
    });

    const receipt = await this.findReceiptByIdUseCase.execute(result.id);

    return { id: result.id, code: receipt.code };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  @Audit({
    entityType: 'receipt',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateReceiptRequest,
  ): Promise<void> {
    await this.updateReceiptNoteUseCase.execute(id, request.note);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Audit({
    entityType: 'receipt',
    action: AuditAction.DELETE,
    entityId: paramId(),
  })
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteReceiptUseCase.execute(id);
  }
}