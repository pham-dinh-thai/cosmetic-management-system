export const OrderStatus = {
  PENDING_CONFIRMATION: 'PENDING_CONFIRMATION',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  DELIVERY_FAILED: 'DELIVERY_FAILED',
  RETURNED: 'RETURNED',
  REFUNDED: 'REFUNDED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderPaymentStatus = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
} as const;

export type OrderPaymentStatus =
  (typeof OrderPaymentStatus)[keyof typeof OrderPaymentStatus];

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

export type OrderShippingInfo = {
  recipientName?: string | null;
  recipientPhone?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
};

export type CreateOrderProps = {
  code: string;
  customerId: string;
  paymentMethod: OrderPaymentMethod;
  paymentStatus?: OrderPaymentStatus;
  lines: CreateOrderLineProps[];
} & OrderShippingInfo;

export type FromPersistentOrderProps = {
  id: string;
  code: string;
  customerId: string;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: OrderPaymentStatus;
  status: OrderStatus;
  totalAmount: number;
  lines: FromPersistentOrderLineProps[];
  createdAt: Date;
  updatedAt: Date;
} & OrderShippingInfo;

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
