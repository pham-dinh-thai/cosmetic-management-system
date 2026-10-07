export interface IUpdateCustomerUserRequest {
  firstName: string;
  lastName: string;
  gender: string;
  email?: string;
}

export interface IUpdateCustomerRequest {
  user: IUpdateCustomerUserRequest;
}
