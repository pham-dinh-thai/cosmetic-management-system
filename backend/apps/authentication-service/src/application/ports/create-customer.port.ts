export interface ICreateCustomerPortRequest {
  userId: string;
  code: string;
}

export interface ICreateCustomerPort {
  execute(request: ICreateCustomerPortRequest): Promise<{ id: string }>;
}

export const CREATE_CUSTOMER_PORT = 'ICreateCustomerPort';
