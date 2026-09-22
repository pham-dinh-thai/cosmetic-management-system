export const CUSTOMER_NAME_READER_PORT = Symbol('CUSTOMER_NAME_READER_PORT');

export interface ICustomerNameReaderPort {
  getCustomerName(customerId: string): Promise<string | null>;
}
