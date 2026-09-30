import { ICreateCustomerRequest } from './create-customer.request';
import { Customer } from '../../../domain/customer.aggregate';
import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';
import { MissingCustomerUserException } from '../../../domain/exceptions/missing-customer-user.exception';
import { CustomerCode } from '../../../domain/value-objects/customer-code.value-object';

export class CreateCustomerUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(
    request: ICreateCustomerRequest,
  ): Promise<{ id: string }> {
    const userId = request.userId ?? '';

    if (!userId) {
      throw new MissingCustomerUserException();
    }

    const maxCodeSequence =
      await this.customersRepository.findMaxCodeSequence();

    const code = CustomerCode.generate((maxCodeSequence ?? 0) + 1);

    const customer = Customer.create({ userId, code });

    return await this.customersRepository.create(customer);
  }
}

export const createCustomerUseCaseFactory = (
  customersRepository: ICustomersRepository,
): CreateCustomerUseCase => new CreateCustomerUseCase(customersRepository);
