import api from "../config/axios";

const DEFAULT_PASSWORD = "Customer@123456";

function splitName(name: string): { firstName: string; lastName: string } {
  const trimmed = name.trim();
  const index = trimmed.lastIndexOf(" ");
  if (index === -1) {
    return { firstName: trimmed, lastName: trimmed };
  }
  return {
    firstName: trimmed.slice(0, index),
    lastName: trimmed.slice(index + 1),
  };
}

export function combineName(
  firstName?: string | null,
  lastName?: string | null,
): string {
  if (firstName && firstName === lastName) return firstName;
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

export interface CustomerSummary {
  id: string;
  userId: string;
  code: string;
  name: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  isActive?: boolean;
}

export interface CustomerDetail extends CustomerSummary {
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

  async createCustomer(payload: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    password?: string;
    gender?: string;
  }): Promise<{ id: string }> {
    const { firstName, lastName } = splitName(payload.name || "");

    const { data } = await api.post<{ id: string }>("/customers", {
      user: {
        firstName,
        lastName,
        gender: payload.gender || "other",
        email: payload.email || "",
        password: payload.password || DEFAULT_PASSWORD,
        roleId: "customer",
      },
      phone: payload.phone || undefined,
      address: payload.address || undefined,
    });

    return data;
  },

  async updateCustomer(
    id: string,
    payload: {
      name?: string;
      phone?: string;
      address?: string;
      gender?: string;
    },
  ): Promise<void> {
    const { firstName, lastName } = splitName(payload.name || "");

    await api.put<void>(`/customers/${id}`, {
      user: {
        firstName,
        lastName,
        gender: payload.gender || "other",
      },
      phone: payload.phone || undefined,
      address: payload.address || undefined,
    });
  },

  async deleteCustomer(id: string): Promise<void> {
    await api.delete<void>(`/customers/${id}`);
  },

  async activateCustomer(id: string): Promise<void> {
    await api.patch<void>(`/customers/${id}/activate`);
  },

  async deactivateCustomer(id: string): Promise<void> {
    await api.patch<void>(`/customers/${id}/deactivate`);
  },
};