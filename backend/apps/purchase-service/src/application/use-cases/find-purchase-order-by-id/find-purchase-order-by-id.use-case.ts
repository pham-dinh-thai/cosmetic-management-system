import { PurchaseOrderNotFoundException } from '../../../domain/exceptions/purchase-order-not-found.exception';
import { IPurchaseOrdersRepository } from '../../../domain/repositories/purchase-orders.repository';
import { PurchaseOrderDetailReadModel } from './read-models/purchase-order-detail.read-model';

export class FindPurchaseOrderByIdUseCase {
  public constructor(
    private readonly purchaseOrdersRepository: IPurchaseOrdersRepository,
  ) {}

  public async execute(id: string): Promise<PurchaseOrderDetailReadModel> {
    const purchaseOrder = await this.purchaseOrdersRepository.findById(id);

    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundException(id);
    }

    return PurchaseOrderDetailReadModel.from(purchaseOrder);
  }
}

export const findPurchaseOrderByIdUseCaseFactory = (
  purchaseOrdersRepository: IPurchaseOrdersRepository,
): FindPurchaseOrderByIdUseCase =>
  new FindPurchaseOrderByIdUseCase(purchaseOrdersRepository);
