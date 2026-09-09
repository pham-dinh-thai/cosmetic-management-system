import { PurchaseOrderNotFoundException } from '../../../domain/exceptions/purchase-order-not-found.exception';
import { IPurchaseOrdersRepository } from '../../../domain/repositories/purchase-orders.repository';
import { IReceiptEnrichmentPort } from '../../../domain/ports/receipt-enrichment.port';
import { PurchaseOrderStatus } from '../../../domain/types';

export interface PurchaseOrderReceiptLine {
  variantId: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrderReceipt {
  id: string;
  code: string;
  status: PurchaseOrderStatus;
  supplierId: string;
  supplierName: string;
  supplierAddress: string | null;
  createdByName: string | null;
  totalAmount: number;
  lines: PurchaseOrderReceiptLine[];
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export class PrintPurchaseOrderUseCase {
  public constructor(
    private readonly purchaseOrdersRepository: IPurchaseOrdersRepository,
    private readonly receiptEnrichmentPort: IReceiptEnrichmentPort,
  ) {}

  public async execute(id: string): Promise<PurchaseOrderReceipt> {
    const purchaseOrder = await this.purchaseOrdersRepository.findById(id);

    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundException(id);
    }

    const [supplier, variantNames, createdByName] = await Promise.all([
      this.receiptEnrichmentPort.getSupplierInfo(purchaseOrder.getSupplierId()),
      this.receiptEnrichmentPort.getVariantNames(
        purchaseOrder.getLines().map((line) => line.getVariantId()),
      ),
      this.receiptEnrichmentPort.getUserName(
        purchaseOrder.getEmployeeId() ?? '',
      ),
    ]);

    return {
      id: purchaseOrder.getId(),
      code: purchaseOrder.getCode(),
      status: purchaseOrder.getStatus(),
      supplierId: purchaseOrder.getSupplierId(),
      supplierName: supplier?.name ?? purchaseOrder.getSupplierId(),
      supplierAddress: supplier?.address ?? null,
      createdByName,
      totalAmount: purchaseOrder.getTotalAmount(),
      lines: purchaseOrder.getLines().map((line) => ({
        variantId: line.getVariantId(),
        variantName:
          variantNames.get(line.getVariantId()) ?? line.getVariantId(),
        quantity: line.getQuantity(),
        unitPrice: line.getUnitPrice(),
        subtotal: line.getSubtotal(),
      })),
      createdAt: purchaseOrder.getCreatedAt(),
      updatedAt: purchaseOrder.getUpdatedAt(),
    };
  }
}

export const printPurchaseOrderUseCaseFactory = (
  purchaseOrdersRepository: IPurchaseOrdersRepository,
  receiptEnrichmentPort: IReceiptEnrichmentPort,
): PrintPurchaseOrderUseCase =>
  new PrintPurchaseOrderUseCase(purchaseOrdersRepository, receiptEnrichmentPort);