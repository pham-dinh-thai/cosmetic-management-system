import { Order } from '../../../../orders/domain/order.aggregate';
import { IMyOrdersRepository } from '../../../domain/repositories/my-orders.repository';
import { OrderCode } from '../../../../orders/domain/value-objects/order-code.value-object';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';
import { OrderPaymentMethod } from '../../../../shared/domain/enums/order-payment-method.enum';
import { OrderPaymentStatus } from '../../../../shared/domain/enums/order-payment-status.enum';
import { IPlaceOrderRequest, OrderChannel } from './place-order.request';
import { IVariantsReaderPort } from '../../ports/variants-reader.port';
import {
  BatchDeduction,
  IRemoveStockPort,
} from '../../ports/remove-stock.port';
import { IReverseInventoryPort } from '../../ports/reverse-inventory.port';
import { IDecreaseCartLineQuantityPort } from '../../ports/decrease-cart-line-quantity.port';
import { IOrderLoggerPort } from '../../ports/order-logger.port';
import {
  CreateInvoiceInput,
  ICreateInvoicePort,
} from '../../ports/create-invoice.port';
import { IFinalizeInvoicePort } from '../../ports/finalize-invoice.port';

export const WALK_IN_CUSTOMER_ID = '00000000-0000-0000-0000-000000000001';

type StockDeduction = {
  variantId: string;
  quantity: number;
  deductions: BatchDeduction[];
};

export class PlaceOrderUseCase {
  public constructor(
    private readonly ordersRepository: IMyOrdersRepository,
    private readonly variantsReaderPort: IVariantsReaderPort,
    private readonly removeStockPort: IRemoveStockPort,
    private readonly reverseInventoryPort: IReverseInventoryPort,
    private readonly decreaseCartLineQuantityPort: IDecreaseCartLineQuantityPort,
    private readonly orderLoggerPort: IOrderLoggerPort,
    private readonly createInvoicePort: ICreateInvoicePort,
    private readonly finalizeInvoicePort: IFinalizeInvoicePort,
  ) {}

  public async execute(
    request: IPlaceOrderRequest,
    channel: OrderChannel,
  ): Promise<{
    id: string;
    status?: OrderStatus;
    total?: number;
    paymentMethod?: OrderPaymentMethod;
  }> {
    const order = await this.buildOrder(request, channel);

    await this.deductStock(order);

    const { id } = await this.ordersRepository.create(order);

    if (channel === 'WEB') {
      await this.decreaseCartLineQuantity(request.customerId, order);

      return { id };
    }

    await this.completePosSale(order, id);

    return {
      id,
      status: order.getStatus(),
      total: order.getTotalAmount(),
      paymentMethod: order.getPaymentMethod(),
    };
  }

  private async buildOrder(
    request: IPlaceOrderRequest,
    channel: OrderChannel,
  ): Promise<Order> {
    const maxCodeSequence = await this.ordersRepository.findMaxCodeSequence();
    const code = OrderCode.generate((maxCodeSequence ?? 0) + 1);

    const pricedLines = await Promise.all(
      request.lines.map(async (line) => ({
        ...line,
        unitPrice: await this.variantsReaderPort.findVariantUnitPrice(
          line.variantId,
        ),
      })),
    );

    const paymentMethod = request.paymentMethod ?? OrderPaymentMethod.CASH;

    return Order.create({
      code: code.getValue(),
      customerId: request.customerId ?? WALK_IN_CUSTOMER_ID,
      paymentMethod,
      paymentStatus:
        channel === 'POS' ? OrderPaymentStatus.PAID : OrderPaymentStatus.UNPAID,
      recipientName: request.recipientName,
      recipientPhone: request.recipientPhone,
      shippingAddress: request.shippingAddress,
      shippingCity: request.shippingCity,
      lines: pricedLines,
    });
  }

  private async completePosSale(order: Order, orderId: string): Promise<void> {
    order.markAsSold();

    await this.ordersRepository.updateStatus(order);

    await this.createInvoicePort.execute(
      this.toCreateInvoiceInput(order, orderId),
    );

    await this.finalizeInvoicePort.execute({ orderId });
  }

  private toCreateInvoiceInput(
    order: Order,
    orderId: string,
  ): CreateInvoiceInput {
    return {
      orderId,
      code: order.getCode(),
      customerId: order.getCustomerId(),
      totalAmount: order.getTotalAmount(),
      paid: true,
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

  private async decreaseCartLineQuantity(
    customerId: string | null | undefined,
    order: Order,
  ): Promise<void> {
    if (!customerId) {
      return;
    }

    await this.decreaseCartLineQuantityPort.execute(
      customerId,
      order.getLines().map((line) => ({
        variantId: line.getVariantId(),
        quantity: line.getQuantity(),
      })),
    );
  }
}

export const placeOrderUseCaseFactory = (
  ordersRepository: IMyOrdersRepository,
  variantsReaderPort: IVariantsReaderPort,
  removeStockPort: IRemoveStockPort,
  reverseInventoryPort: IReverseInventoryPort,
  decreaseCartLineQuantityPort: IDecreaseCartLineQuantityPort,
  orderLoggerPort: IOrderLoggerPort,
  createInvoicePort: ICreateInvoicePort,
  finalizeInvoicePort: IFinalizeInvoicePort,
): PlaceOrderUseCase =>
  new PlaceOrderUseCase(
    ordersRepository,
    variantsReaderPort,
    removeStockPort,
    reverseInventoryPort,
    decreaseCartLineQuantityPort,
    orderLoggerPort,
    createInvoicePort,
    finalizeInvoicePort,
  );
