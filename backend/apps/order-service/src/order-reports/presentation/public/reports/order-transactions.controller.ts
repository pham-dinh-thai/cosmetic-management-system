import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard, Permissions, PermissionsGuard } from '@app/security';
import { FindOrderTransactionsUseCase } from 'apps/order-service/src/order-reports/application/use-cases/find-order-transactions/find-order-transactions.use-case';
import { OrderTransactionReadModel } from 'apps/order-service/src/order-reports/application/use-cases/find-order-transactions/order-transaction.read-model';

@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('orders:read')
@Controller('orders')
export class OrderTransactionsController {
  public constructor(
    private readonly findOrderTransactionsUseCase: FindOrderTransactionsUseCase,
  ) {}

  @Get('transactions')
  public async findTransactions(
    @Query('orderId') orderId?: string,
    @Query('variantId') variantId?: string,
    @Query('employeeId') employeeId?: string,
  ): Promise<OrderTransactionReadModel[]> {
    return await this.findOrderTransactionsUseCase.execute({
      orderId,
      variantId,
      employeeId,
    });
  }
}
