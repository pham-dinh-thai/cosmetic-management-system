export const InvoiceStatus = {
  UNPAID: 'UNPAID',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export type CreateInvoiceProps = {
  code: string;
  orderId: string;
  customerId: string;
  totalAmount: number;
  note?: string;
};

export type FromPersistentInvoiceProps = {
  id: string;
  code: string;
  orderId: string;
  customerId: string;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
};
