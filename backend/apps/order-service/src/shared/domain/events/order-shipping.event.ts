import { OrderDomainEvent } from 'apps/order-service/src/shared/domain/events/order-domain.event';

export class OrderShipping extends OrderDomainEvent {
  public readonly eventType = 'OrderShipping';

  public constructor(
    public readonly id: string,
    public readonly customerId: string,
  ) {
    super();
  }
}
