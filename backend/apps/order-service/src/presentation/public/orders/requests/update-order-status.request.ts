import { IsEnum } from 'class-validator';
import { OrderStatus } from 'apps/order-service/src/domain/types';

export class UpdateOrderStatusRequest {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
