import { Customer } from '../customer.aggregate';

export interface ICustomersRepository {
  findAll(): Promise<Customer[]>;

  findById(id: string): Promise<Customer | null>;

  findByUserId(userId: string): Promise<Customer | null>;

  findMaxCodeSequence(): Promise<number | null>;

  create(customer: Customer): Promise<{ id: string }>;

  delete(id: string): Promise<Customer | null>;

  createAddress(
    customerId: string,
    city: string,
    street: string,
  ): Promise<void>;

  removeAddress(addressId: string): Promise<void>;

  createPhone(customerId: string, phone: string): Promise<void>;

  findPhoneOwnerId(phone: string): Promise<string | null>;

  removePhone(phoneId: string): Promise<void>;
}

export const CUSTOMERS_REPOSITORY = 'ICustomersRepository';
