export interface IDeleteCustomerPort {
  execute(customerId: string): Promise<boolean>;
}

export const DELETE_CUSTOMER_PORT = 'IDeleteCustomerPort';
