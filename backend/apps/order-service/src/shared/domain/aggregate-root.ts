import { OrderDomainEvent } from './events/order-domain.event';

export class AggregateRoot {
  protected events: OrderDomainEvent[] = [];

  public pullDomainEvents(): OrderDomainEvent[] {
    const events = [...this.events];
    this.events.length = 0;
    return events;
  }

  public clearEvents(): void {
    this.events = [];
  }
}
