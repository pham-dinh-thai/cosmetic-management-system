import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';
import { LastAddressRemovalException } from '../../../domain/exceptions/last-address-removal.exception';

export class RemoveAddressUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(customerId: string, addressId: string): Promise<void> {
    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      return;
    }

    if (customer.getAddresses().length <= 1) {
      throw new LastAddressRemovalException();
    }

    await this.customersRepository.removeAddress(addressId);
  }
}

export const removeAddressUseCaseFactory = (
  customersRepository: ICustomersRepository,
): RemoveAddressUseCase => new RemoveAddressUseCase(customersRepository);
