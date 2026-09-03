import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { DeleteCustomerUseCase } from 'apps/customer-service/src/application/use-cases/delete-customer/delete-customer.use-case';

@Controller('internal/customers')
export class InternalCustomersController {
  public constructor(
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCustomerUseCase.execute(id);
  }
}
