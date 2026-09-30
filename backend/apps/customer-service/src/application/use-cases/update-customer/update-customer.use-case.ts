import { CustomerNotFoundException } from '../../../domain/exceptions/customer-not-found.exception';
import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';
import { IUpdateCustomerRequest } from './update-customer.request';
import { type IUpdateUserInformationPort } from './ports/update-user-information.port';

export class UpdateCustomerUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
    private readonly updateUserInformationPort: IUpdateUserInformationPort,
  ) {}

  public async execute(
    id: string,
    request: IUpdateCustomerRequest,
  ): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    if (customer.getUserId()) {
      await this.updateUserInformationPort.execute(customer.getUserId(), {
        firstName: request.user.firstName,
        lastName: request.user.lastName,
        gender: request.user.gender,
      });
    }
  }
}

export const updateCustomerUseCaseFactory = (
  customersRepository: ICustomersRepository,
  updateUserInformationPort: IUpdateUserInformationPort,
): UpdateCustomerUseCase =>
  new UpdateCustomerUseCase(customersRepository, updateUserInformationPort);
