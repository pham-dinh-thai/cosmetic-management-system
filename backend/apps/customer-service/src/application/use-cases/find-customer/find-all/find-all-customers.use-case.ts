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

  public async execute(search?: string): Promise<FindAllCustomerReadModel[]> {
    const customers = await this.customersRepository.findAll();

    const readModels = await Promise.all(
      customers.map(async (customer) => {
        let userInfo: {
          firstName: string;
          lastName: string;
          gender: string;
          email?: string;
          isActive?: boolean;
        } | null = null;
        try {
          userInfo = await this.findUserInformationPort.execute(
            customer.getUserId(),
          );
        } catch (error) {
          this.logger.warn(
            `Could not load user info for customer ${customer.getId()}`,
            error instanceof Error ? error.stack : String(error),
          );
        }

        return new FindAllCustomerReadModel(
          customer.getId(),
          customer.getUserId(),
          customer.getCode(),
          [userInfo?.firstName, userInfo?.lastName]
            .filter(Boolean)
            .join(' ')
            .trim(),
          userInfo?.gender ?? '',
          userInfo?.email ?? '',
          customer.getPhone(),
          customer.getAddress(),
          userInfo?.isActive ?? true,
        );
      }),
    );

    if (!search || !search.trim()) {
      return readModels;
    }

    const keyword = search.trim().toLowerCase();
    return readModels.filter(
      (c) =>
        c.name.toLowerCase().includes(keyword) ||
        c.phone.toLowerCase().includes(keyword) ||
        c.code.toLowerCase().includes(keyword),
    );
  }
}

export const findAllCustomersUseCaseFactory = (
  customersRepository: ICustomersRepository,
  findUserInformationPort: IFindUserInformationPort,
): FindAllCustomersUseCase =>
  new FindAllCustomersUseCase(customersRepository, findUserInformationPort);