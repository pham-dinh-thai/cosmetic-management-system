import { CustomerNotFoundException } from '../../../domain/exceptions/customer-not-found.exception';
import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';

export class DeleteCustomerUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const deletedCustomer = await this.customersRepository.delete(id);

    if (!deletedCustomer) {
      throw new CustomerNotFoundException(id);
    }
  }
}

export const deleteCustomerUseCaseFactory = (
  customersRepository: ICustomersRepository,
): DeleteCustomerUseCase => new DeleteCustomerUseCase(customersRepository);
