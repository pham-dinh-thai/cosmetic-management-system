import { Address } from './entities/address.entity';
import { Phone } from './entities/phone.entity';
import { AddressNotFoundException } from './exceptions/address-not-found.exception';
import { PhoneNotFoundException } from './exceptions/phone-not-found.exception';
import { CreateCustomerProps, FromPersistentCustomerProps } from './types';

export class Customer {
  public constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly code: string,
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
      [],
      [],
    );
  }

  public static fromPersistent(props: FromPersistentCustomerProps): Customer {
    return new Customer(
      props.id,
      props.userId,
      props.code,
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

  public addAddress(city: string, street: string): void {
    const address = Address.create({
      customerId: this.id,
      city: city,
      street: street,
    });

    this.addresses.push(address);
  }

  public addPhone(phoneNumber: string): void {
    const phone = Phone.create({
      customerId: this.id,
      phone: phoneNumber,
    });

    this.phones.push(phone);
  }

  public removeAddress(addressId: string): void {
    const index = this.addresses.findIndex(
      (address) => address.getId() === addressId,
    );

    if (index === -1) {
      throw new AddressNotFoundException(addressId);
    }

    this.addresses.splice(index, 1);
  }

  public removePhone(phoneId: string): void {
    const index = this.phones.findIndex((phone) => phone.getId() === phoneId);

    if (index === -1) {
      throw new PhoneNotFoundException(phoneId);
    }

    this.phones.splice(index, 1);
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
