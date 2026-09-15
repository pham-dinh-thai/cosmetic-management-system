import { CreateSupplierProps, FromPersistentSupplierProps } from './types';
import { SupplierCode } from './value-objects/supplier-code.value-object';
import { Phone } from './value-objects/phone.value-object';

export class Supplier {
  public constructor(
    private readonly id: string,
    private readonly code: SupplierCode,
    private name: string,
    private email: string,
    private phone: Phone | null,
    private address: string | null,
    private isActive: boolean,
    private readonly createdAt?: Date,
    private updatedAt?: Date,
  ) {}

  public static create(props: CreateSupplierProps): Supplier {
    return new Supplier(
      undefined as unknown as string,
      SupplierCode.fromPersistent(props.code),
      props.name,
      props.email,
      props.phone ? Phone.create(props.phone) : null,
      props.address,
      true,
    );
  }

  public static fromPersistent(props: FromPersistentSupplierProps): Supplier {
    return new Supplier(
      props.id,
      SupplierCode.fromPersistent(props.code),
      props.name,
      props.email,
      props.phone ? Phone.fromPersistent(props.phone) : null,
      props.address,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  public getId(): string {
    return this.id;
  }

  public getCode(): string {
    return this.code.getValue();
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPhone(): string | null {
    return this.phone?.getValue() ?? null;
  }

  public getAddress(): string | null {
    return this.address;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}
