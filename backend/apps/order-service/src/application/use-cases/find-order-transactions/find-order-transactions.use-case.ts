import { IOrderTransactionsRepository } from '../../../domain/repositories/order-transactions.repository';
import { OrderTransactionReadModel } from './read-models/order-transaction.read-model';

export class FindOrderTransactionsUseCase {
  public constructor(
    private readonly orderTransactionsRepository: IOrderTransactionsRepository,
  ) {}

  public async execute(options?: {
    orderId?: string;
    variantId?: string;
    employeeId?: string;
  }): Promise<OrderTransactionReadModel[]> {
    const transactions =
      await this.orderTransactionsRepository.findAll(options);

    return transactions.map((transaction) =>
      OrderTransactionReadModel.from(transaction),
    );
  }
}

export const findOrderTransactionsUseCaseFactory = (
  orderTransactionsRepository: IOrderTransactionsRepository,
): FindOrderTransactionsUseCase =>
  new FindOrderTransactionsUseCase(orderTransactionsRepository);
