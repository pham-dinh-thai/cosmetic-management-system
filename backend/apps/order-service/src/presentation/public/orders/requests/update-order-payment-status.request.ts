import { IsEnum } from 'class-validator';
import { OrderPaymentStatus } from 'apps/order-service/src/domain/types';

export class UpdateOrderPaymentStatusRequest {
  @IsEnum(OrderPaymentStatus)
  paymentStatus!: OrderPaymentStatus;
}
