import { InvalidPurchaseOrderStatusException } from '../../../domain/exceptions/invalid-purchase-order-status.exception';
import { PurchaseOrderNotFoundException } from '../../../domain/exceptions/purchase-order-not-found.exception';
import { IPurchaseOrdersRepository } from '../../../domain/repositories/purchase-orders.repository';
import { PurchaseOrderStatus } from '../../../domain/types';

export class DeletePurchaseOrderUseCase {
  public constructor(
    private readonly purchaseOrdersRepository: IPurchaseOrdersRepository,
  ) {}

  public async execute(id: string): Promise<{ id: string }> {
    const purchaseOrder = await this.purchaseOrdersRepository.findById(id);

    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundException(id);
    }

    if (
      !purchaseOrder.isCompletable() &&
      purchaseOrder.getStatus() !== PurchaseOrderStatus.CANCELLED
    ) {
      throw new InvalidPurchaseOrderStatusException(
        id,
        purchaseOrder.getStatus(),
        'DELETED',
      );
    }

    await this.purchaseOrdersRepository.delete(id);

    return { id };
  }
}

export const deletePurchaseOrderUseCaseFactory = (
  purchaseOrdersRepository: IPurchaseOrdersRepository,
): DeletePurchaseOrderUseCase =>
  new DeletePurchaseOrderUseCase(purchaseOrdersRepository);
