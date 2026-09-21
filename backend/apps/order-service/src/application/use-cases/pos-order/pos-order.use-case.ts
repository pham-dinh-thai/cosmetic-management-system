import { Order } from 'apps/order-service/src/domain/order.aggregate';
import { IOrdersRepository } from 'apps/order-service/src/domain/repositories/orders.repository';
import { IRemoveStockPort } from 'apps/order-service/src/domain/ports/remove-stock.port';
import { ICreateInvoicePort } from 'apps/order-service/src/domain/ports/create-invoice.port';
import { OrderCode } from 'apps/order-service/src/domain/value-objects/order-code.value-object';
import type { IOrderLoggerPort } from '../../ports/employee-logger.port';
import type { IVariantsReaderPort } from '../place-order/ports/variants-reader.port';
import type { IReverseInventoryPort } from '../place-order/ports/reverse-inventory.port';
import {
  type IPosOrderRequest,
  type PosOrderPaymentMethod,
} from './pos-order.request';
import { BatchDeduction } from 'apps/order-service/src/domain/ports/remove-stock.port';
import { OrderPaymentStatus } from 'apps/order-service/src/domain/types';

export const WALK_IN_CUSTOMER_ID = '00000000-0000-0000-0000-000000000001';

type StockDeduction = {
  variantId: string;
  quantity: number;
  deductions: BatchDeduction[];
};

export class PosOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly variantsReaderPort: IVariantsReaderPort,
    private readonly removeStockPort: IRemoveStockPort,
    private readonly reverseInventoryPort: IReverseInventoryPort,
    private readonly orderLoggerPort: IOrderLoggerPort,
    private readonly createInvoicePort: ICreateInvoicePort,
  ) {}

  public async execute(request: IPosOrderRequest): Promise<{
    id: string;
    status: string;
    total: number;
    paymentMethod: PosOrderPaymentMethod;
  }> {
    const maxCodeSequence = await this.ordersRepository.findMaxCodeSequence();
    const code = OrderCode.generate((maxCodeSequence ?? 0) + 1);

    const pricedLines = await Promise.all(
      request.items.map(async (item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: await this.variantsReaderPort.findVariantUnitPrice(
          item.variantId,
        ),
      })),
    );

    const order = Order.create({
      code: code.getValue(),
      customerId: request.customerId ?? WALK_IN_CUSTOMER_ID,
      paymentMethod: request.paymentMethod,
      paymentStatus: OrderPaymentStatus.PAID,
      lines: pricedLines,
    });

    order.deliver();

    await this.deductStock(order);

    const { id } = await this.ordersRepository.create(order);

    await this.createInvoicePort.execute({
      orderId: id,
      code: order.getCode(),
      customerId: order.getCustomerId(),
      totalAmount: order.getTotalAmount(),
      paid: true,
    });

    return {
      id,
      status: order.getStatus(),
      total: order.getTotalAmount(),
      paymentMethod: request.paymentMethod,
    };
  }

  private async deductStock(order: Order): Promise<void> {
    const deducted: StockDeduction[] = [];

    try {
      for (const line of order.getLines()) {
        const batchDeductions = await this.removeStockPort.execute(
          line.getVariantId(),
          line.getQuantity(),
        );

        deducted.push({
          variantId: line.getVariantId(),
          quantity: line.getQuantity(),
          deductions: batchDeductions,
        });
      }
    } catch (error) {
      await this.reverseDeductedStock(deducted);
      throw error;
    }
  }

  private async reverseDeductedStock(
    deducted: StockDeduction[],
  ): Promise<void> {
    for (const line of deducted) {
      this.orderLoggerPort.warn(
        `Reverse inventory - variant: ${line.variantId} - quantity: ${line.quantity}`,
      );

      await this.reverseInventoryPort.execute(
        line.variantId,
        line.quantity,
        line.deductions,
      );
    }
  }
}

export const posOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  variantsReaderPort: IVariantsReaderPort,
  removeStockPort: IRemoveStockPort,
  reverseInventoryPort: IReverseInventoryPort,
  orderLoggerPort: IOrderLoggerPort,
  createInvoicePort: ICreateInvoicePort,
): PosOrderUseCase =>
  new PosOrderUseCase(
    ordersRepository,
    variantsReaderPort,
    removeStockPort,
    reverseInventoryPort,
    orderLoggerPort,
    createInvoicePort,
  );
