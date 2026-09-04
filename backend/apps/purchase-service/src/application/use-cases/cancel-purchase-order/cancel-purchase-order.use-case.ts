import { PurchaseOrderNotFoundException } from '../../../domain/exceptions/purchase-order-not-found.exception';
import { IPurchaseOrdersRepository } from '../../../domain/repositories/purchase-orders.repository';

export class CancelPurchaseOrderUseCase {
  public constructor(
    private readonly purchaseOrdersRepository: IPurchaseOrdersRepository,
  ) {}

  public async execute(id: string): Promise<{ id: string }> {
    const purchaseOrder = await this.purchaseOrdersRepository.findById(id);

    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundException(id);
    }

    purchaseOrder.cancel();

    const cancelled = await this.purchaseOrdersRepository.setStatus(
      id,
      purchaseOrder.getStatus(),
    );

    if (!cancelled) {
      throw new PurchaseOrderNotFoundException(id);
    }

    return { id };
  }
}

export const cancelPurchaseOrderUseCaseFactory = (
  purchaseOrdersRepository: IPurchaseOrdersRepository,
): CancelPurchaseOrderUseCase =>
  new CancelPurchaseOrderUseCase(purchaseOrdersRepository);
