import { OrderDomainEvent } from 'apps/order-service/src/shared/domain/events/order-domain.event';

export class OrderCancelled extends OrderDomainEvent {
  public readonly eventType = 'OrderCancelled';

  public constructor(
    public readonly id: string,
    public readonly customerId: string,
  ) {
    super();
  }
}
