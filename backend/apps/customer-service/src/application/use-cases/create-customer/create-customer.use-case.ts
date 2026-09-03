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
    const customer = Customer.create({
      userId: request.userId,
      code: request.code,
    });

    return await this.customersRepository.create(customer);
  }
}

export const createCustomerUseCaseFactory = (
  customersRepository: ICustomersRepository,
): CreateCustomerUseCase => new CreateCustomerUseCase(customersRepository);
