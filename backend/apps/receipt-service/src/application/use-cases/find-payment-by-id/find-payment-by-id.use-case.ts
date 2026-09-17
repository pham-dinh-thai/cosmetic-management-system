import { PaymentNotFoundException } from '../../../domain/exceptions/payment-not-found.exception';
import { PaymentsRepository } from '../../../domain/repositories/payments.repository';
import { PaymentReadModel } from '../find-all-payments/read-models/payment.read-model';

export class FindPaymentByIdUseCase {
  public constructor(private readonly paymentsRepository: PaymentsRepository) {}

  public async execute(id: string): Promise<PaymentReadModel> {
    const payment = await this.paymentsRepository.findById(id);

    if (!payment) {
      throw new PaymentNotFoundException(id);
    }

    return PaymentReadModel.from(payment);
  }
}

export const findPaymentByIdUseCaseFactory = (
  paymentsRepository: PaymentsRepository,
): FindPaymentByIdUseCase => new FindPaymentByIdUseCase(paymentsRepository);