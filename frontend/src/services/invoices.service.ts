import api from "../config/axios";

export type InvoiceStatus = "UNPAID" | "PARTIAL" | "PAID";

export interface InvoiceSummary {
  id: string;
  code: string;
  orderId: string;
  customerId: string;
  totalAmount: number;
  paidAmount: number;
  unpaidBalance: number;
  status: InvoiceStatus;
  createdAt: string;
  note?: string | null;
}

export const invoicesService = {
  async getInvoices(params?: {
    search?: string;
    status?: InvoiceStatus;
    orderId?: string;
    customerId?: string;
  }): Promise<InvoiceSummary[]> {
    const { data } = await api.get<InvoiceSummary[]>("/invoices", { params });
    return data;
  },

  async getInvoiceById(id: string): Promise<InvoiceSummary> {
    const { data } = await api.get<InvoiceSummary>(`/invoices/${id}`);
    return data;
  },

  async recordPayment(id: string, amount: number): Promise<InvoiceSummary> {
    const { data } = await api.put<InvoiceSummary>(`/invoices/${id}/payment`, {
      amount,
    });
    return data;
  },

  async deleteInvoice(id: string): Promise<void> {
    await api.delete<void>(`/invoices/${id}`);
  },
};

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  UNPAID: "Chưa thanh toán",
  PARTIAL: "Thanh toán một phần",
  PAID: "Đã thanh toán",
};
