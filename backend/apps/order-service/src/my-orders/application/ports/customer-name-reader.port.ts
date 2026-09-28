export interface ICustomerNameReaderPort {
  getCustomerName(customerId: string): Promise<string | null>;
}

export const MY_ORDERS_CUSTOMER_NAME_READER_PORT =
  'IMyOrdersCustomerNameReaderPort';
