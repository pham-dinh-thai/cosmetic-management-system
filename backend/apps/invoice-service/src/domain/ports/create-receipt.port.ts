export type CreateReceiptInput = {
  invoiceId: string;
  customerId: string;
  amount: number;
  note?: string;
  employeeId?: string;
};

export interface ICreateReceiptPort {
  execute(input: CreateReceiptInput): Promise<void>;
}

export const CREATE_RECEIPT_PORT = 'CreateReceiptPort';