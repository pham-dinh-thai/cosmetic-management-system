export type CreatePaymentInput = {
  purchaseOrderId: string;
  supplierId: string;
  amount: number;
  employeeId?: string;
};

export interface ICreatePaymentPort {
  execute(input: CreatePaymentInput): Promise<void>;
}

export const CREATE_PAYMENT_PORT = 'CreatePaymentPort';