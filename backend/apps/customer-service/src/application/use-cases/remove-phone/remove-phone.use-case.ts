import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';

export class RemovePhoneUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(customerId: string, phoneId: string): Promise<void> {
    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      return;
    }

    await this.customersRepository.removePhone(phoneId);
  }
}

export const removePhoneUseCaseFactory = (
  customersRepository: ICustomersRepository,
): RemovePhoneUseCase => new RemovePhoneUseCase(customersRepository);
