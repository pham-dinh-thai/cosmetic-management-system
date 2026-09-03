export class FindAllCustomerReadModel {
  public constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly code: string,
  ) {}
}
