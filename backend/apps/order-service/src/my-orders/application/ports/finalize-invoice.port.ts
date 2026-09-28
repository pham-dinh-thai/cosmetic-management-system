export type FinalizeInvoiceInput = {
  orderId: string;
  employeeId?: string;
};

export interface IFinalizeInvoicePort {
  execute(input: FinalizeInvoiceInput): Promise<void>;
}

export const FINALIZE_INVOICE_PORT = 'IMyOrdersFinalizeInvoicePort';
