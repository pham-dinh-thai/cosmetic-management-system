import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../../../../shared/domain/enums/order-status.enum';

export class UpdateOrderStatusRequest {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
