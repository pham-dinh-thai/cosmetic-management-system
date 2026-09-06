import { useEffect, useState } from "react";
import { employeesApi } from "./api";
import type { Employee } from "./type";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    employeesApi.fetchEmployees().then((data) => {
      setEmployees(data);
      setLoading(false);
    });
  }, []);

  const filtered = employees.filter(
    (e) =>
      !q ||
      e.name.toLowerCase().includes(q.toLowerCase()) ||
      e.role.toLowerCase().includes(q.toLowerCase()) ||
      e.code.toLowerCase().includes(q.toLowerCase()),
  );

  return { employees: filtered, loading, q, setQ };
}
