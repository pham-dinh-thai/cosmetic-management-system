import { type ICustomersRepository } from '../../../../domain/repositories/customers.repository';
import { FindCustomerByIdReadModel } from './read-models/find-customer-by-id.read-model';
import {
  type IFindUserInformationPort,
  type UserInformation,
} from '../../update-customer/ports/find-user-information.port';
import { Logger } from '@nestjs/common';

export class FindCustomerByIdUseCase {
  private readonly logger = new Logger(FindCustomerByIdUseCase.name);

  public constructor(
    private readonly customersRepository: ICustomersRepository,
    private readonly findUserInformationPort: IFindUserInformationPort,
  ) {}

  public async execute(id: string): Promise<FindCustomerByIdReadModel | null> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      return null;
    }

    let userInfo: UserInformation | null = null;

    if (customer.getUserId()) {
      try {
        userInfo = await this.findUserInformationPort.execute(
          customer.getUserId(),
        );
      } catch (error) {
        this.logger.warn(
          `Failed to load user information for customer ${customer.getId()}`,
          error instanceof Error ? error.message : undefined,
        );
      }
    }

    const name = userInfo
      ? `${userInfo.firstName} ${userInfo.lastName}`.trim()
      : '';

    const [primaryPhone] = customer.getPhones();
    const [primaryAddress] = customer.getAddresses();

    return new FindCustomerByIdReadModel(
      customer.getId(),
      customer.getUserId(),
      customer.getCode().getValue(),
      name,
      userInfo?.gender ?? '',
      userInfo?.email ?? '',
      primaryPhone?.getPhone() ?? '',
      primaryAddress?.getStreet() ?? '',
      userInfo?.isActive ?? true,
      customer.getAddresses().map((a) => ({
        id: a.getId(),
        city: a.getCity(),
        street: a.getStreet(),
      })),
      customer.getPhones().map((p) => ({
        id: p.getId(),
        phone: p.getPhone(),
      })),
    );
  }
}

export const findCustomerByIdUseCaseFactory = (
  customersRepository: ICustomersRepository,
  findUserInformationPort: IFindUserInformationPort,
): FindCustomerByIdUseCase =>
  new FindCustomerByIdUseCase(customersRepository, findUserInformationPort);
