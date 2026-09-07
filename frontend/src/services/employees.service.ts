import api from "../config/axios";

export interface EmployeeSummary {
  id: string;
  userId: string;
  code: string;
  departmentId: string;
  hiredAt: Date | string;
  status: string;
  position: string;
  phone?: string | null;
  address?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  gender?: string | null;
  email?: string | null;
}

const DEFAULT_PASSWORD = "Employee@123456";

function splitName(name: string): { firstName: string; lastName: string } {
  const trimmed = name.trim();
  const index = trimmed.lastIndexOf(" ");
  if (index === -1) {
    return { firstName: trimmed, lastName: "" };
  }
  return {
    firstName: trimmed.slice(0, index),
    lastName: trimmed.slice(index + 1),
  };
}

export const employeesService = {
  async getEmployees(search?: string): Promise<EmployeeSummary[]> {
    const { data } = await api.get<EmployeeSummary[]>("/employees", {
      params: search ? { search } : undefined,
    });
    return data;
  },

  async getEmployeeById(id: string): Promise<
    EmployeeSummary & { name: string; position: string }
  > {
    const employees = await this.getEmployees();
    const employee = employees.find((e) => e.id === id);
    if (!employee) throw new Error("Employee not found");

    return {
      ...employee,
      name: [employee.firstName, employee.lastName].filter(Boolean).join(" ").trim(),
      phone: employee.phone || "",
      address: employee.address || "",
      email: employee.email || "",
      position: employee.position,
    };
  },

  async createEmployee(payload: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    departmentId?: string;
    position?: string;
    hiredAt?: string;
  }): Promise<void> {
    const { firstName, lastName } = splitName(payload.name || "");

    await api.post<void>("/employees", {
      user: {
        firstName,
        lastName,
        gender: "other",
        email: payload.email || "",
        password: DEFAULT_PASSWORD,
        roleId: "employee",
      },
      departmentId: payload.departmentId,
      hiredAt: payload.hiredAt || new Date().toISOString().split("T")[0],
      position: payload.position || "staff",
      phone: payload.phone || undefined,
      address: payload.address || undefined,
    });
  },

  async updateEmployee(
    id: string,
    payload: {
      name?: string;
      phone?: string;
      address?: string;
      departmentId?: string;
      position?: string;
    },
  ): Promise<void> {
    const { firstName, lastName } = splitName(payload.name || "");

    await api.patch<void>(`/employees/${id}`, {
      user: {
        firstName,
        lastName,
        gender: "other",
      },
      phone: payload.phone || undefined,
      address: payload.address || undefined,
    });

    if (payload.departmentId) {
      await api.patch<void>(`/employees/${id}/department`, {
        departmentId: payload.departmentId,
      });
    }

    if (payload.position) {
      await api.patch<void>(`/employees/${id}/position`, {
        position: payload.position,
      });
    }
  },

  async deleteEmployee(id: string): Promise<void> {
    await api.delete<void>(`/employees/${id}`);
  },
};