import { PurchaseTransaction } from '../../../domain/entities/purchase-transaction.entity';
import { PurchaseOrderNotFoundException } from '../../../domain/exceptions/purchase-order-not-found.exception';
import { IAddStockPort } from '../../../domain/ports/add-stock.port';
import { IPurchaseOrdersRepository } from '../../../domain/repositories/purchase-orders.repository';
import { IPurchaseTransactionsRepository } from '../../../domain/repositories/purchase-transactions.repository';

export class CompletePurchaseOrderUseCase {
  public constructor(
    private readonly purchaseOrdersRepository: IPurchaseOrdersRepository,
    private readonly addStockPort: IAddStockPort,
    private readonly purchaseTransactionsRepository: IPurchaseTransactionsRepository,
  ) {}

  public async execute(
    id: string,
    employeeId: string,
  ): Promise<{ id: string }> {
    const purchaseOrder = await this.purchaseOrdersRepository.findById(id);

    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundException(id);
    }

    if (
      purchaseOrder.getStatus() === 'COMPLETED' &&
      (await this.purchaseTransactionsRepository.existsByPurchaseOrderId(id))
    ) {
      return { id };
    }

    const addedLines: {
      variantId: string;
      batchId: string;
      quantity: number;
    }[] = [];

    try {
      for (const line of purchaseOrder.getLines()) {
        const result = await this.addStockPort.execute(
          line.getVariantId(),
          line.getQuantity(),
          purchaseOrder.getSupplierId(),
          line.getExpiryDate(),
          employeeId,
        );
        addedLines.push({
          variantId: line.getVariantId(),
          batchId: result.batchId,
          quantity: line.getQuantity(),
        });
      }

      purchaseOrder.complete();

      const completed = await this.purchaseOrdersRepository.setStatus(
        id,
        purchaseOrder.getStatus(),
      );

      if (!completed) {
        throw new PurchaseOrderNotFoundException(id);
      }

      const transactions = purchaseOrder.getLines().map((line) =>
        PurchaseTransaction.create({
          purchaseOrderId: purchaseOrder.getId(),
          variantId: line.getVariantId(),
          quantity: line.getQuantity(),
          unitPrice: line.getUnitPrice(),
          employeeId,
        }),
      );

      await this.purchaseTransactionsRepository.saveMany(transactions);
    } catch (error) {
      const byVariant = new Map<
        string,
        { variantId: string; batchId: string; quantity: number }[]
      >();

      for (const line of addedLines) {
        if (!byVariant.has(line.variantId)) {
          byVariant.set(line.variantId, []);
        }
        byVariant.get(line.variantId)?.push(line);
      }

      for (const [variantId, lines] of byVariant) {
        await this.addStockPort.reverse(
          variantId,
          lines.map((l) => ({ batchId: l.batchId, quantity: l.quantity })),
        );
      }
      throw error;
    }

    return { id };
  }
}

export const completePurchaseOrderUseCaseFactory = (
  purchaseOrdersRepository: IPurchaseOrdersRepository,
  addStockPort: IAddStockPort,
  purchaseTransactionsRepository: IPurchaseTransactionsRepository,
): CompletePurchaseOrderUseCase =>
  new CompletePurchaseOrderUseCase(
    purchaseOrdersRepository,
    addStockPort,
    purchaseTransactionsRepository,
  );
