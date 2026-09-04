import { IPurchaseTransactionsRepository } from '../../../domain/repositories/purchase-transactions.repository';
import { PurchaseTransactionReadModel } from './read-models/purchase-transaction.read-model';

export class FindPurchaseTransactionsUseCase {
  public constructor(
    private readonly purchaseTransactionsRepository: IPurchaseTransactionsRepository,
  ) {}

  public async execute(options?: {
    purchaseOrderId?: string;
    variantId?: string;
    employeeId?: string;
  }): Promise<PurchaseTransactionReadModel[]> {
    const transactions =
      await this.purchaseTransactionsRepository.findAll(options);

    return transactions.map((transaction) =>
      PurchaseTransactionReadModel.from(transaction),
    );
  }
}

export const findPurchaseTransactionsUseCaseFactory = (
  purchaseTransactionsRepository: IPurchaseTransactionsRepository,
): FindPurchaseTransactionsUseCase =>
  new FindPurchaseTransactionsUseCase(purchaseTransactionsRepository);
