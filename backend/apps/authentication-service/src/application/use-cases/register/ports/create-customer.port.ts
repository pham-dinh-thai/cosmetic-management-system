export interface ICreateCustomerPortRequest {
  userId: string;
}

export interface ICreateCustomerPort {
  execute(request: ICreateCustomerPortRequest): Promise<{ id: string }>;
}

export const CREATE_CUSTOMER_PORT = 'ICreateCustomerPort';

export interface ICreateCustomerPhonePortRequest {
  customerId: string;
  phone: string;
}

export interface ICreateCustomerPhonePort {
  execute(request: ICreateCustomerPhonePortRequest): Promise<void>;
}

export const CREATE_CUSTOMER_PHONE_PORT = 'ICreateCustomerPhonePort';

export interface ICreateCustomerAddressPortRequest {
  customerId: string;
  street: string;
}

export interface ICreateCustomerAddressPort {
  execute(request: ICreateCustomerAddressPortRequest): Promise<void>;
}

export const CREATE_CUSTOMER_ADDRESS_PORT = 'ICreateCustomerAddressPort';
