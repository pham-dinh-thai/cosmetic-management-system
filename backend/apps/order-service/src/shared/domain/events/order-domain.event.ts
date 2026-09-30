export abstract class OrderDomainEvent {
  public abstract readonly eventType: string;
  public abstract readonly customerId: string;
  public readonly createdAt: Date;

  public constructor() {
    this.createdAt = new Date();
  }
}
