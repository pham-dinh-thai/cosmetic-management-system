import { Receipt } from '../receipt.aggregate';
import { ReceiptSource } from '../types';

export interface ReceiptsRepository {
  findAll(options?: {
    search?: string;
    source?: ReceiptSource;
    invoiceId?: string;
    customerId?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<Receipt[]>;
  findById(id: string): Promise<Receipt | null>;
  findByInvoiceId(invoiceId: string): Promise<Receipt | null>;
  findMaxCodeSequence(): Promise<number | null>;
  create(receipt: Receipt): Promise<{ id: string }>;
  updateNote(id: string, note?: string): Promise<Receipt | null>;
  delete(id: string): Promise<Receipt | null>;
}

export const RECEIPTS_REPOSITORY = 'ReceiptsRepository';