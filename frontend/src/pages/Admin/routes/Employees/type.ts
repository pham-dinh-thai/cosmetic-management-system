export interface Employee {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  departmentId?: string;
  position: string;
  hiredAt?: string;
  status: "ACTIVE" | "INACTIVE";
}
