export interface IUpdateEmployeeInformationRequest {
  user: {
    firstName: string;
    lastName: string;
    gender: string;
  };
  phone?: string;
  address?: string;
}
