import api from "../config/axios";

export interface CreateCustomerPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateCustomerPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CustomerSummary {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CustomerDetail extends CustomerSummary {
  userId: string;
  addresses: { id: string; city: string; street: string }[];
  phones: { id: string; phone: string }[];
}

export const customersService = {
  async getCustomers(search?: string): Promise<CustomerSummary[]> {
    const { data } = await api.get<CustomerSummary[]>("/customers", {
      params: search ? { search } : undefined,
    });
    return data;
  },

  async getCustomerById(id: string): Promise<CustomerDetail> {
    const { data } = await api.get<CustomerDetail>(`/customers/${id}`);
    return data;
  },

  async createCustomer(payload: CreateCustomerPayload): Promise<{ id: string }> {
    const { data } = await api.post<{ id: string }>("/customers", payload);
    return data;
  },

  async updateCustomer(id: string, payload: UpdateCustomerPayload): Promise<void> {
    await api.put<void>(`/customers/${id}`, payload);
  },

  async deleteCustomer(id: string): Promise<void> {
    await api.delete<void>(`/customers/${id}`);
  },
};
