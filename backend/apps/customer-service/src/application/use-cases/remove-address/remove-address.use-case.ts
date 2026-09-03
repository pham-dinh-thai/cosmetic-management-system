import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';

export class RemoveAddressUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(customerId: string, addressId: string): Promise<void> {
    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      return;
    }

    await this.customersRepository.removeAddress(addressId);
  }
}

export const removeAddressUseCaseFactory = (
  customersRepository: ICustomersRepository,
): RemoveAddressUseCase => new RemoveAddressUseCase(customersRepository);
