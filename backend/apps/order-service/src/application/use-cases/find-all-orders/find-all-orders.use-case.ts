import { OrderStatus } from '../../../domain/types';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { ICustomerNameReaderPort } from '../../../domain/ports/customer-name-reader.port';
import { OrderReadModel } from './read-models/order.read-model';

export class FindAllOrdersUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly customerNameReader: ICustomerNameReaderPort,
  ) {}

  public async execute(options?: {
    search?: string;
    status?: OrderStatus;
    customerId?: string;
  }): Promise<OrderReadModel[]> {
    const orders = await this.ordersRepository.findAll(options);

    const nameCache = new Map<string, string | null>();

    const readModels = await Promise.all(
      orders.map(async (order) => {
        const customerId = order.getCustomerId();

        let customerName: string | null = null;

        if (customerId) {
          if (!nameCache.has(customerId)) {
            nameCache.set(
              customerId,
              await this.customerNameReader.getCustomerName(customerId),
            );
          }

          customerName = nameCache.get(customerId) ?? null;
        }

        return OrderReadModel.from(order, customerName);
      }),
    );

    return readModels;
  }
}

export const findAllOrdersUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  customerNameReader: ICustomerNameReaderPort,
): FindAllOrdersUseCase =>
  new FindAllOrdersUseCase(ordersRepository, customerNameReader);
