import { CustomerNotFoundException } from '../../../domain/exceptions/customer-not-found.exception';
import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';
import { IUpdateCustomerRequest } from './update-customer.request';

export class UpdateCustomerUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(id: string, request: IUpdateCustomerRequest): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    customer.update({
      name: request.name,
      email: request.email,
      phone: request.phone,
      address: request.address,
    });

    await this.customersRepository.update(customer);
  }
}

export const updateCustomerUseCaseFactory = (
  customersRepository: ICustomersRepository,
): UpdateCustomerUseCase => new UpdateCustomerUseCase(customersRepository);
