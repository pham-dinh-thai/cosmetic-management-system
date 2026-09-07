import { type ICustomersRepository } from '../../../../domain/repositories/customers.repository';
import { FindAllCustomerReadModel } from './read-models/find-all-customer.read-model';
import { type IFindUserInformationPort } from '../../update-customer/ports/find-user-information.port';
import { Logger } from '@nestjs/common';

export class FindAllCustomersUseCase {
  private readonly logger = new Logger(FindAllCustomersUseCase.name);

  public constructor(
    private readonly customersRepository: ICustomersRepository,
    private readonly findUserInformationPort: IFindUserInformationPort,
  ) {}

  public async execute(): Promise<FindAllCustomerReadModel[]> {
    const customers = await this.customersRepository.findAll();

    const readModels = await Promise.all(
      customers.map(async (customer) => {
        let userInfo: {
          firstName: string;
          lastName: string;
          gender: string;
          email?: string;
        } | null = null;

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

        return new FindAllCustomerReadModel(
          customer.getId(),
          customer.getUserId(),
          customer.getCode(),
          name,
          userInfo?.gender ?? '',
          userInfo?.email ?? '',
          customer.getPhone(),
          customer.getAddress(),
        );
      }),
    );

    return readModels;
  }
}

export const findAllCustomersUseCaseFactory = (
  customersRepository: ICustomersRepository,
  findUserInformationPort: IFindUserInformationPort,
): FindAllCustomersUseCase =>
  new FindAllCustomersUseCase(customersRepository, findUserInformationPort);