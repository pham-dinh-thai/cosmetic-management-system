export type CustomerContact = {
  email: string;
  name: string;
};

export interface ICustomerContactReaderPort {
  getContact(customerId: string): Promise<CustomerContact | null>;
}

export const CUSTOMER_CONTACT_READER_PORT = 'ICustomerContactReaderPort';
