import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { ICustomerNameReaderPort } from '../../ports/customer-name-reader.port';
import { FindAllOrdersReadModel } from './find-all-orders.read-model';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';

export type FindAllOrdersResponse = {
  items: FindAllOrdersReadModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FindAllOrdersOptions = {
  search?: string;
  status?: OrderStatus;
  customerId?: string;
  page?: number;
  limit?: number;
};

export class FindAllOrdersUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly customerNameReader: ICustomerNameReaderPort,
  ) {}

  public async execute(
    options: FindAllOrdersOptions = {},
  ): Promise<FindAllOrdersResponse> {
    const { search, status, customerId, page, limit } = options;
    const paginated = page !== undefined && limit !== undefined;

    const orders = paginated
      ? await this.ordersRepository.findPage((page - 1) * limit, limit, {
          search,
          status,
          customerId,
        })
      : await this.ordersRepository.findAll({ search, status, customerId });

    const total = paginated
      ? await this.ordersRepository.count({ search, status, customerId })
      : orders.length;

    const items = await Promise.all(
      orders.map(async (order) => {
        const customerName = await this.customerNameReader.getCustomerName(
          order.getCustomerId(),
        );

        return FindAllOrdersReadModel.from(order, customerName);
      }),
    );

    return {
      items,
      total,
      page: paginated ? page : 1,
      limit: paginated ? limit : total,
      totalPages: paginated ? Math.ceil(total / limit) : total === 0 ? 0 : 1,
    };
  }
}

export const findAllOrdersUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  customerNameReader: ICustomerNameReaderPort,
) => new FindAllOrdersUseCase(ordersRepository, customerNameReader);
