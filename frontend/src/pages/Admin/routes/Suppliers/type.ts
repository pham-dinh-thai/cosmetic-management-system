export interface Supplier {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
