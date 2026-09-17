import api from "../config/axios";

export type ReceiptSource = "MANUAL" | "AUTO_INVOICE_PAYMENT";

export interface ReceiptSummary {
  id: string;
  code: string;
  amount: number;
  source: ReceiptSource;
  invoiceId: string | null;
  customerId: string | null;
  note: string | null;
  employeeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PaymentCategory =
  | "SUPPLIER"
  | "SALARY"
  | "INFRASTRUCTURE"
  | "MATERIAL"
  | "OTHER";

export type PaymentSource = "MANUAL" | "AUTO_PURCHASE";

export interface PaymentSummary {
  id: string;
  code: string;
  amount: number;
  category: PaymentCategory;
  source: PaymentSource;
  purchaseOrderId: string | null;
  supplierId: string | null;
  note: string | null;
  employeeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReceiptPayload {
  amount: number;
  invoiceId?: string;
  customerId?: string;
  note?: string;
}

export interface CreatePaymentPayload {
  amount: number;
  category: PaymentCategory;
  supplierId?: string;
  note?: string;
}

export const accountingService = {
  async getReceipts(params?: {
    search?: string;
    source?: ReceiptSource;
    fromDate?: string;
    toDate?: string;
  }): Promise<ReceiptSummary[]> {
    const { data } = await api.get<ReceiptSummary[]>("/receipts", { params });
    return data;
  },

  async getReceiptById(id: string): Promise<ReceiptSummary> {
    const { data } = await api.get<ReceiptSummary>(`/receipts/${id}`);
    return data;
  },

  async createReceipt(
    payload: CreateReceiptPayload,
  ): Promise<{ id: string; code: string }> {
    const { data } = await api.post<{ id: string; code: string }>(
      "/receipts",
      payload,
    );
    return data;
  },

  async updateReceipt(id: string, note?: string): Promise<void> {
    await api.put<void>(`/receipts/${id}`, { note });
  },

  async deleteReceipt(id: string): Promise<void> {
    await api.delete<void>(`/receipts/${id}`);
  },

  async getPayments(params?: {
    search?: string;
    category?: PaymentCategory;
    source?: PaymentSource;
    fromDate?: string;
    toDate?: string;
  }): Promise<PaymentSummary[]> {
    const { data } = await api.get<PaymentSummary[]>("/payments", { params });
    return data;
  },

  async getPaymentById(id: string): Promise<PaymentSummary> {
    const { data } = await api.get<PaymentSummary>(`/payments/${id}`);
    return data;
  },

  async createPayment(
    payload: CreatePaymentPayload,
  ): Promise<{ id: string; code: string }> {
    const { data } = await api.post<{ id: string; code: string }>(
      "/payments",
      payload,
    );
    return data;
  },

  async updatePayment(id: string, note?: string): Promise<void> {
    await api.put<void>(`/payments/${id}`, { note });
  },

  async deletePayment(id: string): Promise<void> {
    await api.delete<void>(`/payments/${id}`);
  },
};

export const RECEIPT_SOURCE_LABEL: Record<ReceiptSource, string> = {
  MANUAL: "Thủ công",
  AUTO_INVOICE_PAYMENT: "Tự động (thu nợ)",
};

export const PAYMENT_CATEGORY_LABEL: Record<PaymentCategory, string> = {
  SUPPLIER: "Trả nhà cung cấp",
  SALARY: "Lương",
  INFRASTRUCTURE: "Cơ sở hạ tầng",
  MATERIAL: "Vật chất",
  OTHER: "Khác",
};

export const PAYMENT_SOURCE_LABEL: Record<PaymentSource, string> = {
  MANUAL: "Thủ công",
  AUTO_PURCHASE: "Tự động (nhập hàng)",
};