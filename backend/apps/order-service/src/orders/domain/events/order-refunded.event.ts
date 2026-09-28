import { OrderDomainEvent } from 'apps/order-service/src/shared/domain/events/order-domain.event';

export class OrderRefunded extends OrderDomainEvent {
  public constructor(
    public readonly id: string,
    public readonly customerId: string,
  ) {
    super();
  }
}
