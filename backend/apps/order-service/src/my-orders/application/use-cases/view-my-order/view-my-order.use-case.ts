import { ForbiddenException } from '@nestjs/common';
import { Order } from '../../../../shared/domain/order.aggregate';
import { OrderNotFoundException } from '../../../../shared/domain/exceptions/order-not-found.exception';
import { IMyOrdersRepository } from '../../../domain/repositories/my-orders.repository';
import { ICustomerNameReaderPort } from '../../ports/customer-name-reader.port';
import { MyOrderDetailReadModel } from './my-order-detail.read-model';

export class ViewMyOrderUseCase {
  public constructor(
    private readonly ordersRepository: IMyOrdersRepository,
    private readonly customerNameReader: ICustomerNameReaderPort,
  ) {}

  public async execute(
    id: string,
    customerId: string,
  ): Promise<MyOrderDetailReadModel> {
    const order = await this.assertMine(id, customerId);

    const customerName = await this.customerNameReader.getCustomerName(
      order.getCustomerId(),
    );

    return MyOrderDetailReadModel.from(order, customerName);
  }

  public async assertMine(id: string, customerId: string): Promise<Order> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    if (order.getCustomerId() !== customerId) {
      throw new ForbiddenException();
    }

    return order;
  }
}

export const viewMyOrderUseCaseFactory = (
  ordersRepository: IMyOrdersRepository,
  customerNameReader: ICustomerNameReaderPort,
): ViewMyOrderUseCase =>
  new ViewMyOrderUseCase(ordersRepository, customerNameReader);
