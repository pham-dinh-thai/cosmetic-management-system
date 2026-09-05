export interface ICustomerReaderPort {
  findByUserId(userId: string): Promise<{ id: string } | null>;
}

export const CUSTOMER_READER_PORT = 'ICustomerReaderPort';
