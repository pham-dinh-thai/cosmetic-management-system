import { PurchaseOrderNotFoundException } from '../../../domain/exceptions/purchase-order-not-found.exception';
import { IAddStockPort } from '../../../domain/ports/add-stock.port';
import { IPurchaseOrdersRepository } from '../../../domain/repositories/purchase-orders.repository';

export class CompletePurchaseOrderUseCase {
  public constructor(
    private readonly purchaseOrdersRepository: IPurchaseOrdersRepository,
    private readonly addStockPort: IAddStockPort,
  ) {}

  public async execute(id: string): Promise<{ id: string }> {
    const purchaseOrder = await this.purchaseOrdersRepository.findById(id);

    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundException(id);
    }

    purchaseOrder.complete();

    const completed = await this.purchaseOrdersRepository.setStatus(
      id,
      purchaseOrder.getStatus(),
    );

    if (!completed) {
      throw new PurchaseOrderNotFoundException(id);
    }

    for (const line of purchaseOrder.getLines()) {
      await this.addStockPort.execute(line.getVariantId(), line.getQuantity());
    }

    return { id };
  }
}

export const completePurchaseOrderUseCaseFactory = (
  purchaseOrdersRepository: IPurchaseOrdersRepository,
  addStockPort: IAddStockPort,
): CompletePurchaseOrderUseCase =>
  new CompletePurchaseOrderUseCase(purchaseOrdersRepository, addStockPort);
