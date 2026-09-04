export const OrderStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

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
  lines: CreateOrderLineProps[];
};

export type FromPersistentOrderProps = {
  id: string;
  code: string;
  customerId: string;
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
