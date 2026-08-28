export interface IUpdateEmployeeInformationRequest {
  user: {
    firstName: string;
    lastName: string;
    gender: string;
    roleId: string;
  };
  phone?: string;
  address?: string;
}
