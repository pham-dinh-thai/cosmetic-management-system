import { useEffect, useState, useCallback } from "react";
import { employeesService } from "../../../../services/employees.service";
import type { Employee } from "./type";

function mapPosition(position?: string): string {
  switch (position) {
    case "staff":
      return "MEMBER";
    case "manager":
      return "MANAGER";
    default:
      return position || "MEMBER";
  }
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const fetchEmployees = useCallback(() => {
    setLoading(true);
    employeesService.getEmployees().then((data) => {
      setEmployees(
        data.map((e) => ({
          id: e.id,
          code: e.code,
          name: [e.firstName, e.lastName].filter(Boolean).join(" ").trim(),
          phone: e.phone || "",
          email: e.email || "",
          address: e.address || "",
          departmentId: e.departmentId,
          position: mapPosition(e.position),
          hiredAt: e.hiredAt ? String(e.hiredAt) : undefined,
          status: (e.status as Employee["status"]) || "ACTIVE",
        })),
      );
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDeleteEmployee = async (id: string) => {
    await employeesService.deleteEmployee(id);
    fetchEmployees();
  };

  const filtered = employees.filter(
    (e) =>
      !q ||
      e.name.toLowerCase().includes(q.toLowerCase()) ||
      e.code.toLowerCase().includes(q.toLowerCase()) ||
      e.phone.includes(q),
  );

  return { employees: filtered, loading, q, setQ, handleDeleteEmployee };
}
