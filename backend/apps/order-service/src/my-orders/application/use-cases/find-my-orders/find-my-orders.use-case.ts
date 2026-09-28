import { IMyOrdersRepository } from '../../../domain/repositories/my-orders.repository';
import { ICustomerNameReaderPort } from '../../ports/customer-name-reader.port';
import { MyOrderSummaryReadModel } from './my-order-summary.read-model';

export class FindMyOrdersUseCase {
  public constructor(
    private readonly ordersRepository: IMyOrdersRepository,
    private readonly customerNameReader: ICustomerNameReaderPort,
  ) {}

  public async execute(customerId: string): Promise<MyOrderSummaryReadModel[]> {
    const orders = await this.ordersRepository.findAllByCustomer(customerId);

    const customerName =
      await this.customerNameReader.getCustomerName(customerId);

    return orders.map((order) =>
      MyOrderSummaryReadModel.from(order, customerName),
    );
  }
}

export const findMyOrdersUseCaseFactory = (
  ordersRepository: IMyOrdersRepository,
  customerNameReader: ICustomerNameReaderPort,
): FindMyOrdersUseCase =>
  new FindMyOrdersUseCase(ordersRepository, customerNameReader);
