import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { ICustomerNameReaderPort } from '../../ports/customer-name-reader.port';
import { ViewOrderDetailReadModel } from './view-order-detail.read-model';

export class ViewOrderDetailUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly customerNameReader: ICustomerNameReaderPort,
  ) {}

  public async execute(id: string) {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    const customerName = await this.customerNameReader.getCustomerName(
      order.getCustomerId(),
    );

    return ViewOrderDetailReadModel.from(order, customerName);
  }
}

export const viewOrderDetailUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  customerNameReader: ICustomerNameReaderPort,
) => new ViewOrderDetailUseCase(ordersRepository, customerNameReader);
