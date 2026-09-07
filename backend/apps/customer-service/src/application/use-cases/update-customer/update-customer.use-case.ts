import { CustomerNotFoundException } from '../../../domain/exceptions/customer-not-found.exception';
import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';
import { IUpdateCustomerRequest } from './update-customer.request';
import { type IUpdateUserInformationPort } from './ports/update-user-information.port';
import { type IFindUserInformationPort } from './ports/find-user-information.port';
import { Logger } from '@nestjs/common';

export class UpdateCustomerUseCase {
  private readonly logger = new Logger(UpdateCustomerUseCase.name);

  public constructor(
    private readonly customersRepository: ICustomersRepository,
    private readonly updateUserInformationPort: IUpdateUserInformationPort,
    private readonly findUserInformationPort: IFindUserInformationPort,
  ) {}

  public async execute(
    id: string,
    request: IUpdateCustomerRequest,
  ): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    const previousUserInformation = customer.getUserId()
      ? await this.findUserInformationPort.execute(customer.getUserId())
      : null;

    if (customer.getUserId()) {
      await this.updateUserInformationPort.execute(customer.getUserId(), {
        firstName: request.user.firstName,
        lastName: request.user.lastName,
        gender: request.user.gender,
      });
    }

    try {
      customer.update({
        phone: request.phone ?? customer.getPhone(),
        address: request.address ?? customer.getAddress(),
      });

      await this.customersRepository.update(customer);
    } catch (error) {
      if (previousUserInformation) {
        this.logger.warn(
          `Failed to update customer ${id} after user update, rolling back user info`,
          error instanceof Error ? error.stack : undefined,
        );

        await this.updateUserInformationPort.execute(customer.getUserId(), {
          firstName: previousUserInformation.firstName,
          lastName: previousUserInformation.lastName,
          gender: previousUserInformation.gender,
        });
      }

      throw error;
    }
  }
}

export const updateCustomerUseCaseFactory = (
  customersRepository: ICustomersRepository,
  updateUserInformationPort: IUpdateUserInformationPort,
  findUserInformationPort: IFindUserInformationPort,
): UpdateCustomerUseCase =>
  new UpdateCustomerUseCase(
    customersRepository,
    updateUserInformationPort,
    findUserInformationPort,
  );
