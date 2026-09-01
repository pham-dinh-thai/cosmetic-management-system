import { CreateAddressProps, FromPersistentAddressProps } from './types';

export class Address {
  private constructor(
    private readonly id: string,
    private readonly customerId: string,
    private city: string,
    private street: string,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateAddressProps): Address {
    return new Address(
      undefined as unknown as string,
      props.customerId,
      props.city,
      props.street,
    );
  }

  public static fromPersistent(props: FromPersistentAddressProps): Address {
    return new Address(
      props.id,
      props.customerId,
      props.city,
      props.street,
      props.createdAt,
      props.updatedAt,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getCustomerId(): string {
    return this.customerId;
  }

  public getCity(): string {
    return this.city;
  }

  public getStreet(): string {
    return this.street;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}
