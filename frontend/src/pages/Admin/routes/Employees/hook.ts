import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { employeesService, combineName } from "../../../../services/employees.service";
import { departmentsService } from "../../../../services/departments.service";
import type { Employee } from "./type";

function mapPosition(position?: string): string {
  switch (position) {
    case "staff":
      return "Nhân viên";
    case "manager":
      return "Quản lý";
    default:
      return position || "Nhân viên";
  }
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const fetchEmployees = useCallback(() => {
    setLoading(true);
    Promise.all([
      employeesService.getEmployees(),
      departmentsService.getDepartments(),
    ]).then(([data, departments]) => {
      const departmentName = new Map(departments.map((d) => [d.id, d.name]));
      setEmployees(
        data.map((e) => ({
          id: e.id,
          code: e.code,
          name: combineName(e.firstName, e.lastName),
          phone: e.phone || "",
          email: e.email || "",
          address: e.address || "",
          departmentId: e.departmentId,
          department: e.departmentId
            ? departmentName.get(e.departmentId) || e.departmentId
            : "-",
          position: mapPosition(e.position),
          hiredAt: e.hiredAt ? String(e.hiredAt) : undefined,
          status: (e.status as Employee["status"]) || "ACTIVE",
        })),
      );
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDeleteEmployee = async (id: string) => {
    try {
      await employeesService.deleteEmployee(id);
      toast.success("Đã xoá nhân viên thành công");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xoá nhân viên");
    }
  };

  const filtered = employees.filter(
    (e) =>
      !q ||
      e.name.toLowerCase().includes(q.toLowerCase()) ||
      e.code.toLowerCase().includes(q.toLowerCase()) ||
      e.phone.includes(q) ||
      (e.department || "").toLowerCase().includes(q.toLowerCase()),
  );

  return { employees: filtered, loading, q, setQ, handleDeleteEmployee };
}
