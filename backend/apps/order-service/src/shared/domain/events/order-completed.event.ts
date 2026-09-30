import { OrderDomainEvent } from 'apps/order-service/src/shared/domain/events/order-domain.event';

export class OrderCompleted extends OrderDomainEvent {
  public readonly eventType = 'OrderCompleted';

  public constructor(
    public readonly id: string,
    public readonly customerId: string,
  ) {
    super();
  }
}
