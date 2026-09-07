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

    const readModels = customers.map(
      (customer) =>
        new FindAllCustomerReadModel(
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