export interface IUpdateCustomerUserRequest {
  firstName: string;
  lastName: string;
  gender: string;
}

export interface IUpdateCustomerRequest {
  user: IUpdateCustomerUserRequest;
  phone?: string;
  address?: string;
}
