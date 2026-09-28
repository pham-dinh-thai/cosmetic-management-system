import { IsEnum } from 'class-validator';
import { OrderPaymentStatus } from '../../../../../shared/domain/enums/order-payment-status.enum';

export class UpdateOrderPaymentStatusRequest {
  @IsEnum(OrderPaymentStatus)
  paymentStatus!: OrderPaymentStatus;
}
