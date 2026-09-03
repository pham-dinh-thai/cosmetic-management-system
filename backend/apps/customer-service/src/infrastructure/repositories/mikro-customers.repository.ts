import { Injectable } from '@nestjs/common';
import { ICustomersRepository } from '../../domain/repositories/customers.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { Customer as CustomerMikro } from '../entities/customer.entity';
import { Address as AddressMikro } from '../entities/address.entity';
import { Phone as PhoneMikro } from '../entities/phone.entity';
import { CustomersMapper } from '../mappers/customers.mapper';
import { Customer } from '../../domain/customer.aggregate';

@Injectable()
export class MikroCustomersRepository implements ICustomersRepository {
  public constructor(private readonly entityManager: EntityManager) {}

  public async findAll(): Promise<Customer[]> {
    const customersMikro = await this.entityManager.find(
      CustomerMikro,
      {},
      { populate: ['addresses', 'phones'] },
    );

    return customersMikro.map((customerMikro) =>
      CustomersMapper.toDomain(customerMikro),
    );
  }

  public async findById(id: string): Promise<Customer | null> {
    const customerMikro = await this.entityManager.findOne(
      CustomerMikro,
      { id },
      { populate: ['addresses', 'phones'] },
    );

    return customerMikro ? CustomersMapper.toDomain(customerMikro) : null;
  }

  public async create(customer: Customer): Promise<{ id: string }> {
    const customerMikro = CustomersMapper.toMikro(customer);

    this.entityManager.persist(customerMikro);
    await this.entityManager.flush();

    return { id: customerMikro.id };
  }

  public async delete(id: string): Promise<Customer | null> {
    const customerMikro = await this.entityManager.findOne(
      CustomerMikro,
      { id },
      { populate: ['addresses', 'phones'] },
    );

    if (!customerMikro) {
      return null;
    }

    const customer = CustomersMapper.toDomain(customerMikro);

    this.entityManager.remove(customerMikro);
    await this.entityManager.flush();

    return customer;
  }

  public async createAddress(
    customerId: string,
    city: string,
    street: string,
  ): Promise<void> {
    const addressMikro = new AddressMikro();

    addressMikro.customer = this.entityManager.getReference(
      CustomerMikro,
      customerId,
    );
    addressMikro.city = city;
    addressMikro.street = street;

    this.entityManager.persist(addressMikro);
    await this.entityManager.flush();
  }

  public async removeAddress(addressId: string): Promise<void> {
    const addressMikro = await this.entityManager.findOne(AddressMikro, {
      id: addressId,
    });

    if (addressMikro) {
      this.entityManager.remove(addressMikro);
      await this.entityManager.flush();
    }
  }

  public async createPhone(customerId: string, phone: string): Promise<void> {
    const phoneMikro = new PhoneMikro();

    phoneMikro.customer = this.entityManager.getReference(
      CustomerMikro,
      customerId,
    );
    phoneMikro.phone = phone;

    this.entityManager.persist(phoneMikro);
    await this.entityManager.flush();
  }

  public async removePhone(phoneId: string): Promise<void> {
    const phoneMikro = await this.entityManager.findOne(PhoneMikro, {
      id: phoneId,
    });

    if (phoneMikro) {
      this.entityManager.remove(phoneMikro);
      await this.entityManager.flush();
    }
  }
}
