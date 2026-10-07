import api from "../config/axios";

export function splitName(name: string): {
  firstName: string;
  lastName: string;
} {
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

export interface MeCustomer {
  id: string;
  code: string;
  userId?: string;
  name?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  addresses?: { id: string; city: string; street: string }[];
  phones?: { id: string; phone: string }[];
}

export const customersService = {
  async getMe(): Promise<MeCustomer | null> {
    const { data } = await api.get<MeCustomer | null>("/customers/me");
    return data;
  },

  async ensureMe(): Promise<MeCustomer> {
    const { data } = await api.post<MeCustomer>("/customers/me");
    return data;
  },

  async updateMe(payload: {
    user: { firstName: string; lastName: string; gender: string };
  }): Promise<void> {
    await api.put<void>("/customers/me", payload);
  },

  async addMyPhone(phone: string): Promise<void> {
    await api.post<void>("/customers/me/phones", { phone });
  },

  async addMyAddress(street: string): Promise<void> {
    await api.post<void>("/customers/me/addresses", { city: "", street });
  },

  async removeMyAddress(addressId: string): Promise<void> {
    const profile = await this.getMe();
    if (!profile) return;
    await api.delete<void>(`/customers/${profile.id}/addresses/${addressId}`);
  },

  async addPhone(customerId: string, phone: string): Promise<void> {
    await api.post<void>(`/customers/${customerId}/phones`, { phone });
  },

  async addAddress(customerId: string, street: string): Promise<void> {
    await api.post<void>(`/customers/${customerId}/addresses`, {
      city: "",
      street,
    });
  },

  async removePhone(customerId: string, phoneId: string): Promise<void> {
    await api.delete<void>(`/customers/${customerId}/phones/${phoneId}`);
  },

  async removeAddress(customerId: string, addressId: string): Promise<void> {
    await api.delete<void>(`/customers/${customerId}/addresses/${addressId}`);
  },

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

  async updateCustomer(
    id: string,
    payload: {
      name?: string;
      gender?: string;
      email?: string;
    },
  ): Promise<void> {
    const { firstName, lastName } = splitName(payload.name || "");
    const email = payload.email?.trim();

    await api.put<void>(`/customers/${id}`, {
      user: {
        firstName,
        lastName,
        gender: payload.gender || "other",
        ...(email ? { email } : {}),
      },
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
