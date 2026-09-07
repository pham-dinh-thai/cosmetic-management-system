export class FindAllCustomerReadModel {
  public constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly code: string,
    public readonly name: string,
    public readonly gender: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly address: string,
  ) {}
}