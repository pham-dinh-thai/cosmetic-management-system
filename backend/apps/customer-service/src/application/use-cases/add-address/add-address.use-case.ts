import { IAddAddressRequest } from './add-address.request';
import { CustomerNotFoundException } from '../../../domain/exceptions/customer-not-found.exception';
import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';

export class AddAddressUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(
    customerId: string,
    request: IAddAddressRequest,
  ): Promise<void> {
    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      throw new CustomerNotFoundException(customerId);
    }

    await this.customersRepository.createAddress(
      customerId,
      request.city,
      request.street,
    );
  }
}

export const addAddressUseCaseFactory = (
  customersRepository: ICustomersRepository,
): AddAddressUseCase => new AddAddressUseCase(customersRepository);
