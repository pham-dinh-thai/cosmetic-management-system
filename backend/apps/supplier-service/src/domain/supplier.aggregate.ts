import { CreateSupplierProps, FromPersistentSupplierProps } from './types';
import { SupplierCode } from './value-objects/supplier-code.value-object';

export class Supplier {
  public constructor(
    private readonly id: string,
    private readonly code: SupplierCode,
    private name: string,
    private email: string,
    private phone: string | null,
    private address: string | null,
    private isActive: boolean,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateSupplierProps): Supplier {
    return new Supplier(
      undefined as unknown as string,
      SupplierCode.fromPersistent(props.code),
      props.name,
      props.email,
      props.phone,
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
      props.phone,
      props.address,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
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
    return this.phone;
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
