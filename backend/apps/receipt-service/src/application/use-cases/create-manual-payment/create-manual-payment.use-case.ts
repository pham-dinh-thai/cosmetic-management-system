import { Payment } from '../../../domain/payment.aggregate';
import { PaymentCategory } from '../../../domain/types';
import { PaymentsRepository } from '../../../domain/repositories/payments.repository';
import { PaymentCode } from '../../../domain/value-objects/payment-code.value-object';

export type CreateManualPaymentInput = {
  amount: number;
  category: PaymentCategory;
  supplierId?: string;
  note?: string;
  employeeId?: string;
};

export class CreateManualPaymentUseCase {
  public constructor(private readonly paymentsRepository: PaymentsRepository) {}

  public async execute(input: CreateManualPaymentInput): Promise<{ id: string }> {
    const maxCodeSequence = await this.paymentsRepository.findMaxCodeSequence();
    const code = PaymentCode.generate((maxCodeSequence ?? 0) + 1);

    const payment = Payment.create({
      code: code.getValue(),
      amount: input.amount,
      category: input.category,
      supplierId: input.supplierId,
      note: input.note,
      employeeId: input.employeeId,
    });

    return await this.paymentsRepository.create(payment);
  }
}

export const createManualPaymentUseCaseFactory = (
  paymentsRepository: PaymentsRepository,
): CreateManualPaymentUseCase =>
  new CreateManualPaymentUseCase(paymentsRepository);