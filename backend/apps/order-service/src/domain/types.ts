export const OrderStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderPaymentMethod = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CARD: 'CARD',
} as const;

export type OrderPaymentMethod =
  (typeof OrderPaymentMethod)[keyof typeof OrderPaymentMethod];

export type CreateOrderLineProps = {
  variantId: string;
  quantity: number;
  unitPrice: number;
};

export type FromPersistentOrderLineProps = {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateOrderProps = {
  code: string;
  customerId: string;
  paymentMethod: OrderPaymentMethod;
  lines: CreateOrderLineProps[];
};

export type FromPersistentOrderProps = {
  id: string;
  code: string;
  customerId: string;
  paymentMethod: OrderPaymentMethod;
  status: OrderStatus;
  totalAmount: number;
  lines: FromPersistentOrderLineProps[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateOrderTransactionProps = {
  orderId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  employeeId: string;
};

export type FromPersistentOrderTransactionProps = {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
};
