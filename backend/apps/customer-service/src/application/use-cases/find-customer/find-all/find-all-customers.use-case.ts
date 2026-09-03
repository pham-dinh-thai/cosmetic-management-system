import { type ICustomersRepository } from '../../../../domain/repositories/customers.repository';
import { FindAllCustomerReadModel } from './read-models/find-all-customer.read-model';

export class FindAllCustomersUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(): Promise<FindAllCustomerReadModel[]> {
    const customers = await this.customersRepository.findAll();

    return customers.map(
      (customer) =>
        new FindAllCustomerReadModel(
          customer.getId(),
          customer.getUserId(),
          customer.getCode(),
        ),
    );
  }
}

export const findAllCustomersUseCaseFactory = (
  customersRepository: ICustomersRepository,
): FindAllCustomersUseCase => new FindAllCustomersUseCase(customersRepository);
