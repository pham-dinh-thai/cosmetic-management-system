export const ReceiptSource = {
  MANUAL: 'MANUAL',
  AUTO_INVOICE_PAYMENT: 'AUTO_INVOICE_PAYMENT',
} as const;

export type ReceiptSource = (typeof ReceiptSource)[keyof typeof ReceiptSource];

export const PaymentCategory = {
  SUPPLIER: 'SUPPLIER',
  SALARY: 'SALARY',
  INFRASTRUCTURE: 'INFRASTRUCTURE',
  MATERIAL: 'MATERIAL',
  OTHER: 'OTHER',
} as const;

export type PaymentCategory =
  (typeof PaymentCategory)[keyof typeof PaymentCategory];

export const PaymentSource = {
  MANUAL: 'MANUAL',
  AUTO_PURCHASE: 'AUTO_PURCHASE',
} as const;

export type PaymentSource = (typeof PaymentSource)[keyof typeof PaymentSource];

export type CreateReceiptProps = {
  code: string;
  amount: number;
  source?: ReceiptSource;
  invoiceId?: string;
  customerId?: string;
  note?: string;
  employeeId?: string;
};

export type FromPersistentReceiptProps = {
  id: string;
  code: string;
  amount: number;
  source: ReceiptSource;
  invoiceId?: string;
  customerId?: string;
  note?: string;
  employeeId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePaymentProps = {
  code: string;
  amount: number;
  category?: PaymentCategory;
  source?: PaymentSource;
  purchaseOrderId?: string;
  supplierId?: string;
  note?: string;
  employeeId?: string;
};

export type FromPersistentPaymentProps = {
  id: string;
  code: string;
  amount: number;
  category: PaymentCategory;
  source: PaymentSource;
  purchaseOrderId?: string;
  supplierId?: string;
  note?: string;
  employeeId?: string;
  createdAt: Date;
  updatedAt: Date;
};