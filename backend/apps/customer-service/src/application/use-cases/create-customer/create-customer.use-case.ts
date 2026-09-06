import { ICreateCustomerRequest } from './create-customer.request';
import { Customer } from '../../../domain/customer.aggregate';
import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';

export class CreateCustomerUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(
    request: ICreateCustomerRequest,
  ): Promise<{ id: string }> {
    const customers = await this.customersRepository.findAll();

    const code =
      request.code && request.code.trim().length > 0
        ? request.code
        : `KH-${String(customers.length + 1).padStart(3, '0')}`;

    const customer = Customer.create({
      userId: request.userId ?? '',
      code,
      name: request.name ?? '',
      email: request.email ?? '',
      phone: request.phone ?? '',
      address: request.address ?? '',
    });

    return await this.customersRepository.create(customer);
  }
}

export const createCustomerUseCaseFactory = (
  customersRepository: ICustomersRepository,
): CreateCustomerUseCase => new CreateCustomerUseCase(customersRepository);
