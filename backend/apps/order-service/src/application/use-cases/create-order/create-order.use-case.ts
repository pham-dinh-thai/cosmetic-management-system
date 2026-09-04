import { Order } from '../../../domain/order.aggregate';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { OrderCode } from '../../../domain/value-objects/order-code.value-object';
import { ICreateOrderRequest } from './create-order.request';

export class CreateOrderUseCase {
  public constructor(private readonly ordersRepository: IOrdersRepository) {}

  public async execute(request: ICreateOrderRequest): Promise<{ id: string }> {
    const code = OrderCode.generate((await this.ordersRepository.count()) + 1);

    const order = Order.create({
      code: code.getValue(),
      customerId: request.customerId,
      lines: request.lines,
    });

    return await this.ordersRepository.create(order);
  }
}

export const createOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
): CreateOrderUseCase => new CreateOrderUseCase(ordersRepository);
