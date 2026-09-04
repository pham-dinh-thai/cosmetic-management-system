import { PurchaseOrder } from '../../../domain/purchase-order.aggregate';
import { IPurchaseOrdersRepository } from '../../../domain/repositories/purchase-orders.repository';
import { PurchaseOrderCode } from '../../../domain/value-objects/purchase-order-code.value-object';
import { ICreatePurchaseOrderRequest } from './create-purchase-order.request';

export class CreatePurchaseOrderUseCase {
  public constructor(
    private readonly purchaseOrdersRepository: IPurchaseOrdersRepository,
  ) {}

  public async execute(
    request: ICreatePurchaseOrderRequest,
  ): Promise<{ id: string }> {
    const code = PurchaseOrderCode.generate(
      (await this.purchaseOrdersRepository.count()) + 1,
    );

    const purchaseOrder = PurchaseOrder.create({
      code: code.getValue(),
      supplierId: request.supplierId,
      lines: request.lines,
    });

    return await this.purchaseOrdersRepository.create(purchaseOrder);
  }
}

export const createPurchaseOrderUseCaseFactory = (
  purchaseOrdersRepository: IPurchaseOrdersRepository,
): CreatePurchaseOrderUseCase =>
  new CreatePurchaseOrderUseCase(purchaseOrdersRepository);
