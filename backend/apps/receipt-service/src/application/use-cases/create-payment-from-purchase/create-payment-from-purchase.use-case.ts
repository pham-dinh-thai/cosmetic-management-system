import { Payment } from '../../../domain/payment.aggregate';
import { PaymentCategory, PaymentSource } from '../../../domain/types';
import { PaymentsRepository } from '../../../domain/repositories/payments.repository';
import { PaymentCode } from '../../../domain/value-objects/payment-code.value-object';

export type CreatePaymentFromPurchaseEvent = {
  purchaseOrderId: string;
  supplierId: string;
  amount: number;
  employeeId?: string;
};

export class CreatePaymentFromPurchaseUseCase {
  public constructor(private readonly paymentsRepository: PaymentsRepository) {}

  public async execute(
    event: CreatePaymentFromPurchaseEvent,
  ): Promise<{ id: string } | null> {
    const existing = await this.paymentsRepository.findByPurchaseOrderId(
      event.purchaseOrderId,
    );

    if (existing) {
      return null;
    }

    const maxCodeSequence = await this.paymentsRepository.findMaxCodeSequence();
    const code = PaymentCode.generate((maxCodeSequence ?? 0) + 1);

    const payment = Payment.create({
      code: code.getValue(),
      amount: event.amount,
      category: PaymentCategory.SUPPLIER,
      source: PaymentSource.AUTO_PURCHASE,
      purchaseOrderId: event.purchaseOrderId,
      supplierId: event.supplierId,
      note: `Thanh toán tiền hàng theo phiếu nhập`,
      employeeId: event.employeeId,
    });

    return await this.paymentsRepository.create(payment);
  }
}

export const createPaymentFromPurchaseUseCaseFactory = (
  paymentsRepository: PaymentsRepository,
): CreatePaymentFromPurchaseUseCase =>
  new CreatePaymentFromPurchaseUseCase(paymentsRepository);