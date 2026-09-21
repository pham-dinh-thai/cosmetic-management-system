import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { ICustomerNameReaderPort } from '../../../domain/ports/customer-name-reader.port';
import { OrderDetailReadModel } from './read-models/order-detail.read-model';

export class FindOrderByIdUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly customerNameReader: ICustomerNameReaderPort,
  ) {}

  public async execute(id: string): Promise<OrderDetailReadModel> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    const customerId = order.getCustomerId();
    const customerName = customerId
      ? await this.customerNameReader.getCustomerName(customerId)
      : null;

    return OrderDetailReadModel.from(order, customerName);
  }
}

export const findOrderByIdUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  customerNameReader: ICustomerNameReaderPort,
): FindOrderByIdUseCase =>
  new FindOrderByIdUseCase(ordersRepository, customerNameReader);
