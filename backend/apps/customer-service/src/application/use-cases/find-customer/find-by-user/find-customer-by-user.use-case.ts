import { type ICustomersRepository } from '../../../../domain/repositories/customers.repository';
import { FindCustomerByUserReadModel } from './read-models/find-customer-by-user.read-model';

export class FindCustomerByUserUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(
    userId: string,
  ): Promise<FindCustomerByUserReadModel | null> {
    const customer = await this.customersRepository.findByUserId(userId);

    return customer
      ? new FindCustomerByUserReadModel(customer.getId(), customer.getCode())
      : null;
  }
}

export const findCustomerByUserUseCaseFactory = (
  customersRepository: ICustomersRepository,
): FindCustomerByUserUseCase =>
  new FindCustomerByUserUseCase(customersRepository);
