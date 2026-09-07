import { Controller, Get, Param } from '@nestjs/common';
import { FindSupplierByIdUseCase } from 'apps/supplier-service/src/application/use-cases/find-supplier/find-by-id/find-supplier-by-id.use-case';

@Controller('internal/suppliers')
export class InternalSuppliersController {
  public constructor(
    private readonly findSupplierByIdUseCase: FindSupplierByIdUseCase,
  ) {}

  @Get(':id')
  public async findById(@Param('id') id: string) {
    return await this.findSupplierByIdUseCase.execute(id);
  }
}