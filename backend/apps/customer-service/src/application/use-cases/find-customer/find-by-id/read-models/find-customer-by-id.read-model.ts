export class FindCustomerByIdReadModel {
  public constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly code: string,
    public readonly addresses: {
      id: string;
      city: string;
      street: string;
    }[],
    public readonly phones: {
      id: string;
      phone: string;
    }[],
  ) {}
}
