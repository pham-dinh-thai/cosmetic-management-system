import { OrderDomainEvent } from 'apps/order-service/src/shared/domain/events/order-domain.event';

export class OrderReturned extends OrderDomainEvent {
  public readonly eventType = 'OrderReturned';

  public constructor(
    public readonly id: string,
    public readonly customerId: string,
  ) {
    super();
  }
}
