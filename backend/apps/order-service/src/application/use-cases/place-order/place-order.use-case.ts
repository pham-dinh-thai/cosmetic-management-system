import { Order } from 'apps/order-service/src/domain/order.aggregate';
import { IOrdersRepository } from 'apps/order-service/src/domain/repositories/orders.repository';
import { OrderCode } from 'apps/order-service/src/domain/value-objects/order-code.value-object';
import { IPlaceOrderRequest } from './place-order.request';
import { IVariantsReaderPort } from './ports/variants-reader.port';
import { IRemoveStockPort } from 'apps/order-service/src/domain/ports/remove-stock.port';
import { IReverseInventoryPort } from './ports/reverse-inventory.port';
import { IDecreaseCartLineQuantityPort } from './ports/decrease-cart-line-quantity.port';
import { IOrderLoggerPort } from '../../ports/employee-logger.port';

type StockDeduction = { variantId: string; quantity: number };

export class PlaceOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly variantsReaderPort: IVariantsReaderPort,
    private readonly removeStockPort: IRemoveStockPort,
    private readonly reverseInventoryPort: IReverseInventoryPort,
    private readonly decreaseCartLineQuantityPort: IDecreaseCartLineQuantityPort,
    private readonly orderLoggerPort: IOrderLoggerPort,
  ) {}

  public async execute(request: IPlaceOrderRequest): Promise<{ id: string }> {
    const order = await this.buildOrder(request.customerId, request.lines);

    await this.deductStock(order);

    const { id } = await this.ordersRepository.create(order);

    await this.decreaseCartLineQuantity(request.customerId, order);

    return { id };
  }

  private async buildOrder(
    customerId: string,
    lines: IPlaceOrderRequest['lines'],
  ): Promise<Order> {
    const maxCodeSequence = await this.ordersRepository.findMaxCodeSequence();
    const code = OrderCode.generate((maxCodeSequence ?? 0) + 1);

    const pricedLines = await Promise.all(
      lines.map(async (line) => ({
        ...line,
        unitPrice: await this.variantsReaderPort.findVariantUnitPrice(
          line.variantId,
        ),
      })),
    );

    return Order.create({
      code: code.getValue(),
      customerId,
      lines: pricedLines,
    });
  }

  private async deductStock(order: Order): Promise<void> {
    const deducted: StockDeduction[] = [];

    try {
      for (const line of order.getLines()) {
        await this.removeStockPort.execute(
          line.getVariantId(),
          line.getQuantity(),
        );

        deducted.push({
          variantId: line.getVariantId(),
          quantity: line.getQuantity(),
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

      await this.reverseInventoryPort.execute(line.variantId, line.quantity);
    }
  }

  private async decreaseCartLineQuantity(
    customerId: string,
    order: Order,
  ): Promise<void> {
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
  ordersRepository: IOrdersRepository,
  variantsReaderPort: IVariantsReaderPort,
  removeStockPort: IRemoveStockPort,
  reverseInventoryPort: IReverseInventoryPort,
  decreaseCartLineQuantityPort: IDecreaseCartLineQuantityPort,
  orderLoggerPort: IOrderLoggerPort,
): PlaceOrderUseCase =>
  new PlaceOrderUseCase(
    ordersRepository,
    variantsReaderPort,
    removeStockPort,
    reverseInventoryPort,
    decreaseCartLineQuantityPort,
    orderLoggerPort,
  );
