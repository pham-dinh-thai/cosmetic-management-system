import { CustomerCode } from './value-objects/customer-code.value-object';

export type AddressProps = {
  id: string;
  city: string;
  street: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PhoneProps = {
  id: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCustomerProps = {
  userId: string;
  code: CustomerCode;
};

export type FromPersistentCustomerProps = {
  id: string;
  userId: string;
  code: CustomerCode;
  addresses: AddressProps[];
  phones: PhoneProps[];
  createdAt: Date;
  updatedAt: Date;
};
