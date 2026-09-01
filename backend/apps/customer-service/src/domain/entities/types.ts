export type CreateAddressProps = {
  customerId: string;
  city: string;
  street: string;
};

export type FromPersistentAddressProps = {
  id: string;
  customerId: string;
  city: string;
  street: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePhoneProps = {
  customerId: string;
  phone: string;
};

export type FromPersistentPhoneProps = {
  id: string;
  customerId: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};
