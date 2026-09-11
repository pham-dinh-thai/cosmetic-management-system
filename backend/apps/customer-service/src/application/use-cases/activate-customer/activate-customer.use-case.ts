import { CustomerNotFoundException } from '../../../domain/exceptions/customer-not-found.exception';
import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';
import { type IUpdateUserActiveStatusPort } from '../update-customer/ports/update-user-active-status.port';

export class ActivateCustomerUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
    private readonly updateUserActiveStatusPort: IUpdateUserActiveStatusPort,
  ) {}

  public async execute(id: string): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    await this.updateUserActiveStatusPort.activate(customer.getUserId());
  }
}

export const activateCustomerUseCaseFactory = (
  customersRepository: ICustomersRepository,
  updateUserActiveStatusPort: IUpdateUserActiveStatusPort,
): ActivateCustomerUseCase =>
  new ActivateCustomerUseCase(customersRepository, updateUserActiveStatusPort);
