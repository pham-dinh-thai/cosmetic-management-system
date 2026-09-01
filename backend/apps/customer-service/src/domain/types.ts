export type AddressProps = {
  id: string;
  city: string;
  street: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PhoneProps = {
  id: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCustomerProps = {
  userId: string;
  code: string;
};

export type FromPersistentCustomerProps = {
  id: string;
  userId: string;
  code: string;
  addresses: AddressProps[];
  phones: PhoneProps[];
  createdAt: Date;
  updatedAt: Date;
};
