export interface ICustomerIdReaderPort {
  getCustomerIdByUserId(userId: string): Promise<string | null>;
}

export const CUSTOMER_ID_READER_PORT = 'ICustomerIdReaderPort';
