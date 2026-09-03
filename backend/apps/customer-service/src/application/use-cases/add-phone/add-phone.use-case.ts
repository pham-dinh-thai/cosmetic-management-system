import { IAddPhoneRequest } from './add-phone.request';
import { CustomerNotFoundException } from '../../../domain/exceptions/customer-not-found.exception';
import { type ICustomersRepository } from '../../../domain/repositories/customers.repository';
import { PhoneValidationService } from '../../../domain/services/phone-validation.service';

export class AddPhoneUseCase {
  public constructor(
    private readonly customersRepository: ICustomersRepository,
    private readonly phoneValidationService: PhoneValidationService,
  ) {}

  public async execute(
    customerId: string,
    request: IAddPhoneRequest,
  ): Promise<void> {
    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      throw new CustomerNotFoundException(customerId);
    }

    this.phoneValidationService.ensureValidPhone(request.phone);

    await this.customersRepository.createPhone(customerId, request.phone);
  }
}

export const addPhoneUseCaseFactory = (
  customersRepository: ICustomersRepository,
  phoneValidationService: PhoneValidationService,
): AddPhoneUseCase =>
  new AddPhoneUseCase(customersRepository, phoneValidationService);
