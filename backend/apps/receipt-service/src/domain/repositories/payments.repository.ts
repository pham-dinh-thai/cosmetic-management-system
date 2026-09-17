import { Payment } from '../payment.aggregate';
import { PaymentCategory, PaymentSource } from '../types';

export interface PaymentsRepository {
  findAll(options?: {
    search?: string;
    category?: PaymentCategory;
    source?: PaymentSource;
    purchaseOrderId?: string;
    supplierId?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<Payment[]>;
  findById(id: string): Promise<Payment | null>;
  findByPurchaseOrderId(purchaseOrderId: string): Promise<Payment | null>;
  findMaxCodeSequence(): Promise<number | null>;
  create(payment: Payment): Promise<{ id: string }>;
  updateNote(id: string, note?: string): Promise<Payment | null>;
  delete(id: string): Promise<Payment | null>;
}

export const PAYMENTS_REPOSITORY = 'PaymentsRepository';