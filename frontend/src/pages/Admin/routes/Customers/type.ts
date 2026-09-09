export interface Customer {
  id: string;
  code: string;
  name: string;
  gender?: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
  orders: number;
}
