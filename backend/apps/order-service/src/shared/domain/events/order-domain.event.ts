export class OrderDomainEvent {
  public readonly createdAt: Date;

  public constructor() {
    this.createdAt = new Date();
  }
}
