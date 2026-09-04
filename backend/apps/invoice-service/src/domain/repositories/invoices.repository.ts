import { Invoice } from '../invoice.aggregate';
import { InvoiceStatus } from '../types';

export interface InvoicesRepository {
  findAll(options?: {
    search?: string;
    status?: InvoiceStatus;
    orderId?: string;
    customerId?: string;
  }): Promise<Invoice[]>;
  findById(id: string): Promise<Invoice | null>;
  findByOrderId(orderId: string): Promise<Invoice | null>;
  count(): Promise<number>;
  create(invoice: Invoice): Promise<{ id: string }>;
  recordPayment(id: string, amount: number): Promise<Invoice | null>;
  updateNote(id: string, note?: string): Promise<Invoice | null>;
  delete(id: string): Promise<Invoice | null>;
}

export const INVOICES_REPOSITORY = 'InvoicesRepository';
