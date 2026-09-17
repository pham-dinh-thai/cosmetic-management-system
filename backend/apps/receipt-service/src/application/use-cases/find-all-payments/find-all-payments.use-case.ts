import {
  PaymentCategory,
  PaymentSource,
} from '../../../domain/types';
import { PaymentsRepository } from '../../../domain/repositories/payments.repository';
import { PaymentReadModel } from './read-models/payment.read-model';

export class FindAllPaymentsUseCase {
  public constructor(private readonly paymentsRepository: PaymentsRepository) {}

  public async execute(options?: {
    search?: string;
    category?: PaymentCategory;
    source?: PaymentSource;
    purchaseOrderId?: string;
    supplierId?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<PaymentReadModel[]> {
    const payments = await this.paymentsRepository.findAll({
      search: options?.search,
      category: options?.category,
      source: options?.source,
      purchaseOrderId: options?.purchaseOrderId,
      supplierId: options?.supplierId,
      fromDate: options?.fromDate ? new Date(options.fromDate) : undefined,
      toDate: options?.toDate ? new Date(options.toDate) : undefined,
    });

    return payments.map((payment) => PaymentReadModel.from(payment));
  }
}

export const findAllPaymentsUseCaseFactory = (
  paymentsRepository: PaymentsRepository,
): FindAllPaymentsUseCase => new FindAllPaymentsUseCase(paymentsRepository);