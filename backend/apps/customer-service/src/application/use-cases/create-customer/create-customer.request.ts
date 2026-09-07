export interface ICreateCustomerUserRequest {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
  roleId: string;
}

export interface ICreateCustomerRequest {
  userId?: string;
  code?: string;
  user?: ICreateCustomerUserRequest;
  phone?: string;
  address?: string;
}
