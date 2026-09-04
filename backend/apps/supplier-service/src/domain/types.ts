import { SupplierCode } from './value-objects/supplier-code.value-object';

export type CreateSupplierProps = {
  code: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

export type UpdateSupplierProps = {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

export type FromPersistentSupplierProps = {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};