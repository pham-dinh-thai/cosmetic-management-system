import { CanNotUpdateOrderStatusException } from '../../../../shared/domain/exceptions/can-not-update-order-status.exception';
import { OrderNotFoundException } from '../../../../shared/domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';

export class DeleteOrderUseCase {
  public constructor(private readonly ordersRepository: IOrdersRepository) {}

  public async execute(id: string): Promise<{ id: string }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    if (order.getStatus() !== OrderStatus.PENDING) {
      throw new CanNotUpdateOrderStatusException(
        'Chỉ có thể xóa đơn hàng ở trạng thái chờ xác nhận',
      );
    }

    const deleted = await this.ordersRepository.delete(id);

    if (!deleted) {
      throw new OrderNotFoundException(id);
    }

    return { id };
  }
}

export const deleteOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
): DeleteOrderUseCase => new DeleteOrderUseCase(ordersRepository);
