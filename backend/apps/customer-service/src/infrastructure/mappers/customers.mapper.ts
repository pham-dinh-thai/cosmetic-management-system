import { Customer } from '../../domain/customer.aggregate';
import { Customer as CustomerMikro } from '../entities/customer.entity';

export class CustomersMapper {
  public static toDomain(customerMikro: CustomerMikro): Customer {
    return Customer.fromPersistent({
      id: customerMikro.id,
      userId: customerMikro.userId,
      code: customerMikro.code,
      addresses: customerMikro.addresses.getItems().map((address) => ({
        id: address.id,
        city: address.city,
        street: address.street,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
      })),
      phones: customerMikro.phones.getItems().map((phone) => ({
        id: phone.id,
        phone: phone.phone,
        createdAt: phone.createdAt,
        updatedAt: phone.updatedAt,
      })),
      createdAt: customerMikro.createdAt,
      updatedAt: customerMikro.updatedAt,
    });
  }

  public static toMikro(customer: Customer): CustomerMikro {
    const customerMikro = new CustomerMikro();

    customerMikro.userId = customer.getUserId();
    customerMikro.code = customer.getCode();

    return customerMikro;
  }
}
