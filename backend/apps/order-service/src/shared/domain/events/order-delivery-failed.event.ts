import { OrderDomainEvent } from 'apps/order-service/src/shared/domain/events/order-domain.event';

export class OrderDeliveryFailed extends OrderDomainEvent {
  public readonly eventType = 'OrderDeliveryFailed';

  public constructor(
    public readonly id: string,
    public readonly customerId: string,
  ) {
    super();
  }
}
