import api from "../config/axios";

export interface SupplierSummary {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupplierPayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

export const suppliersService = {
  async getSuppliers(search?: string): Promise<SupplierSummary[]> {
    const { data } = await api.get<SupplierSummary[]>("/suppliers", {
      params: search ? { search } : undefined,
    });
    return data;
  },

  async getSupplierById(id: string): Promise<SupplierSummary> {
    const { data } = await api.get<SupplierSummary>(`/suppliers/${id}`);
    return data;
  },

  async createSupplier(payload: CreateSupplierPayload): Promise<{ id: string }> {
    const { data } = await api.post<{ id: string }>("/suppliers", {
      name: payload.name,
      email: payload.email,
      phone: payload.phone || undefined,
      address: payload.address || undefined,
    });

    if (payload.isActive === false) {
      await this.deactivateSupplier(data.id);
    }

    return data;
  },

  async updateSupplier(id: string, payload: CreateSupplierPayload): Promise<void> {
    await api.put<void>(`/suppliers/${id}`, {
      name: payload.name,
      email: payload.email,
      phone: payload.phone || undefined,
      address: payload.address || undefined,
    });

    if (payload.isActive === false) {
      await this.deactivateSupplier(id);
    } else if (payload.isActive === true) {
      await this.activateSupplier(id);
    }
  },

  async deleteSupplier(id: string): Promise<void> {
    await api.delete<void>(`/suppliers/${id}`);
  },

  async activateSupplier(id: string): Promise<void> {
    await api.patch<void>(`/suppliers/${id}/activate`);
  },

  async deactivateSupplier(id: string): Promise<void> {
    await api.patch<void>(`/suppliers/${id}/deactivate`);
  },
};