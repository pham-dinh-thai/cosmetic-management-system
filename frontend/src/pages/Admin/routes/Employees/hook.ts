import { useEffect, useState, useCallback } from "react";
import { employeesService } from "../../../../services/employees.service";
import type { Employee } from "./type";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const fetchEmployees = useCallback(() => {
    setLoading(true);
    employeesService.getEmployees().then((data) => {
      setEmployees(data);
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
