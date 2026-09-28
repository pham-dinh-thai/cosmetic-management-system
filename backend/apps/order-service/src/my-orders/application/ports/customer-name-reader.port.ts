export interface ICustomerNameReaderPort {
  getCustomerName(customerId: string): Promise<string | null>;
}

export const CUSTOMER_NAME_READER_PORT = 'ICustomerNameReaderPort';
