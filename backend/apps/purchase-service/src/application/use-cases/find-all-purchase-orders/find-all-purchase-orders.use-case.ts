import { IPurchaseOrdersRepository } from '../../../domain/repositories/purchase-orders.repository';
import { PurchaseOrderStatus } from '../../../domain/types';
import { PurchaseOrderReadModel } from './read-models/purchase-order.read-model';

export class FindAllPurchaseOrdersUseCase {
  public constructor(
    private readonly purchaseOrdersRepository: IPurchaseOrdersRepository,
  ) {}

  public async execute(options?: {
    search?: string;
    status?: PurchaseOrderStatus;
    supplierId?: string;
  }): Promise<PurchaseOrderReadModel[]> {
    const purchaseOrders = await this.purchaseOrdersRepository.findAll(options);

    return purchaseOrders.map((order) => PurchaseOrderReadModel.from(order));
  }
}

export const findAllPurchaseOrdersUseCaseFactory = (
  purchaseOrdersRepository: IPurchaseOrdersRepository,
): FindAllPurchaseOrdersUseCase =>
  new FindAllPurchaseOrdersUseCase(purchaseOrdersRepository);
