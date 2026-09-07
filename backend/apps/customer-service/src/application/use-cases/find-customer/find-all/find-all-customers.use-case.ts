import { type ICustomersRepository } from '../../../../domain/repositories/customers.repository';
import { FindAllCustomerReadModel } from './read-models/find-all-customer.read-model';

export class FindAllCustomersUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(search?: string): Promise<FindAllCustomerReadModel[]> {
    const customers = await this.customersRepository.findAll();

    const readModels = customers.map(
      (customer) =>
        new FindAllCustomerReadModel(
          customer.getId(),
          customer.getUserId(),
          customer.getCode(),
          customer.getName(),
          customer.getEmail(),
          customer.getPhone(),
          customer.getAddress(),
        ),
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
): FindAllCustomersUseCase => new FindAllCustomersUseCase(customersRepository);
