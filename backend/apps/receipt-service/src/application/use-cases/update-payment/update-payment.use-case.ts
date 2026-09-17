import { PaymentNotFoundException } from '../../../domain/exceptions/payment-not-found.exception';
import { PaymentsRepository } from '../../../domain/repositories/payments.repository';

export class UpdatePaymentNoteUseCase {
  public constructor(private readonly paymentsRepository: PaymentsRepository) {}

  public async execute(id: string, note?: string): Promise<void> {
    const updated = await this.paymentsRepository.updateNote(id, note);

    if (!updated) {
      throw new PaymentNotFoundException(id);
    }
  }
}

export const updatePaymentNoteUseCaseFactory = (
  paymentsRepository: PaymentsRepository,
): UpdatePaymentNoteUseCase => new UpdatePaymentNoteUseCase(paymentsRepository);