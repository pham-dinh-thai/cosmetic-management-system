export interface CustomerLabel {
  code: string;
  name: string;
}

export interface ICustomerNameReaderPort {
  getCustomerName(customerId: string): Promise<string | null>;
  getCustomerLabel(customerId: string): Promise<CustomerLabel | null>;
}

export const CUSTOMER_NAME_READER_PORT = 'IOrdersCustomerNameReaderPort';
