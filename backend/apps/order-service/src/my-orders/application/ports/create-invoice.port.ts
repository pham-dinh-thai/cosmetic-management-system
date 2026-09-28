export type CreateInvoiceInput = {
  orderId: string;
  code: string;
  customerId: string;
  totalAmount: number;
  paid?: boolean;
  employeeId?: string;
};

export interface ICreateInvoicePort {
  execute(input: CreateInvoiceInput): Promise<void>;
}

export const CREATE_INVOICE_PORT = 'CreateInvoicePort';
