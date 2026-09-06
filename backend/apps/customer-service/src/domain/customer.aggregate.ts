import { Address } from './entities/address.entity';
import { Phone } from './entities/phone.entity';
import {
  CreateCustomerProps,
  FromPersistentCustomerProps,
  UpdateCustomerProps,
} from './types';

export class Customer {
  public constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly code: string,
    private name: string,
    private email: string,
    private phone: string,
    private address: string,
    private addresses: Address[],
    private phones: Phone[],
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateCustomerProps): Customer {
    return new Customer(
      undefined as unknown as string,
      props.userId,
      props.code,
      props.name,
      props.email,
      props.phone,
      props.address,
      [],
      [],
    );
  }

  public static fromPersistent(props: FromPersistentCustomerProps): Customer {
    return new Customer(
      props.id,
      props.userId,
      props.code,
      props.name,
      props.email,
      props.phone,
      props.address,
      props.addresses.map((address) =>
        Address.fromPersistent({
          id: address.id,
          customerId: props.id,
          city: address.city,
          street: address.street,
          createdAt: address.createdAt,
          updatedAt: address.updatedAt,
        }),
      ),
      props.phones.map((phone) =>
        Phone.fromPersistent({
          id: phone.id,
          customerId: props.id,
          phone: phone.phone,
          createdAt: phone.createdAt,
          updatedAt: phone.updatedAt,
        }),
      ),
      props.createdAt,
      props.updatedAt,
    );
  }

  public update(props: UpdateCustomerProps): void {
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.address = props.address;
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getCode(): string {
    return this.code;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getAddress(): string {
    return this.address;
  }

  public getAddresses(): Address[] {
    return [...this.addresses];
  }

  public getPhones(): Phone[] {
    return [...this.phones];
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}
