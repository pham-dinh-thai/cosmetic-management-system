export interface ICreateEmployeeRequest {
  user: {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    password: string;
    roleId: string;
  };
  departmentId: string;
  hiredAt: string;
  position: string;
  phone?: string;
  address?: string;
}
