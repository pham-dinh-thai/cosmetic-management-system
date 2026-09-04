import { PurchaseOrderNotFoundException } from '../../../domain/exceptions/purchase-order-not-found.exception';
import { IPurchaseOrdersRepository } from '../../../domain/repositories/purchase-orders.repository';
import { IUpdatePurchaseOrderRequest } from './update-purchase-order.request';

export class UpdatePurchaseOrderUseCase {
  public constructor(
    private readonly purchaseOrdersRepository: IPurchaseOrdersRepository,
  ) {}

  public async execute(
    id: string,
    request: IUpdatePurchaseOrderRequest,
  ): Promise<{ id: string }> {
    const purchaseOrder = await this.purchaseOrdersRepository.findById(id);

    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundException(id);
    }

    purchaseOrder.replaceLines(request.lines);

    const updated = await this.purchaseOrdersRepository.replaceLines(
      id,
      request.lines,
    );

    if (!updated) {
      throw new PurchaseOrderNotFoundException(id);
    }

    return { id };
  }
}

export const updatePurchaseOrderUseCaseFactory = (
  purchaseOrdersRepository: IPurchaseOrdersRepository,
): UpdatePurchaseOrderUseCase =>
  new UpdatePurchaseOrderUseCase(purchaseOrdersRepository);
