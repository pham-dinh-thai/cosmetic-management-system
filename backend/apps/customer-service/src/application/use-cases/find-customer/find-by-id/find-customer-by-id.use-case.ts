import { type ICustomersRepository } from '../../../../domain/repositories/customers.repository';
import { FindCustomerByIdReadModel } from './read-models/find-customer-by-id.read-model';

export class FindCustomerByIdUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(id: string): Promise<FindCustomerByIdReadModel | null> {
    const customer = await this.customersRepository.findById(id);

    return customer
      ? new FindCustomerByIdReadModel(
          customer.getId(),
          customer.getUserId(),
          customer.getCode(),
          customer.getAddresses().map((a) => ({
            id: a.getId(),
            city: a.getCity(),
            street: a.getStreet(),
          })),
          customer.getPhones().map((p) => ({
            id: p.getId(),
            phone: p.getPhone(),
          })),
        )
      : null;
  }
}

export const findCustomerByIdUseCaseFactory = (
  customersRepository: ICustomersRepository,
): FindCustomerByIdUseCase => new FindCustomerByIdUseCase(customersRepository);
