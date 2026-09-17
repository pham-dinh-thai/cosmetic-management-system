import { PaymentNotFoundException } from '../../../domain/exceptions/payment-not-found.exception';
import { PaymentsRepository } from '../../../domain/repositories/payments.repository';

export class DeletePaymentUseCase {
  public constructor(private readonly paymentsRepository: PaymentsRepository) {}

  public async execute(id: string): Promise<void> {
    const deleted = await this.paymentsRepository.delete(id);

    if (!deleted) {
      throw new PaymentNotFoundException(id);
    }
  }
}

export const deletePaymentUseCaseFactory = (
  paymentsRepository: PaymentsRepository,
): DeletePaymentUseCase => new DeletePaymentUseCase(paymentsRepository);