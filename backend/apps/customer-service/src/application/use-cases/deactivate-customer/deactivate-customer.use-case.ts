import { CustomerNotFoundException } from '../../../domain/exceptions/customer-not-found.exception';
import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';
import { type IUpdateUserActiveStatusPort } from '../update-customer/ports/update-user-active-status.port';

export class DeactivateCustomerUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
    private readonly updateUserActiveStatusPort: IUpdateUserActiveStatusPort,
  ) {}

  public async execute(id: string): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    await this.updateUserActiveStatusPort.deactivate(customer.getUserId());
  }
}

export const deactivateCustomerUseCaseFactory = (
  customersRepository: ICustomersRepository,
  updateUserActiveStatusPort: IUpdateUserActiveStatusPort,
): DeactivateCustomerUseCase =>
  new DeactivateCustomerUseCase(
    customersRepository,
    updateUserActiveStatusPort,
  );
