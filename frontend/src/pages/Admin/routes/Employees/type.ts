export interface Employee {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  departmentId?: string;
  department?: string;
  position: string;
  hiredAt?: string;
  status: "ACTIVE" | "INACTIVE";
  gender?: string;
}
