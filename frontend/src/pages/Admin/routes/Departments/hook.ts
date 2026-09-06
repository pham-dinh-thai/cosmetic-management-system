import { useEffect, useState, useCallback } from "react";
import { departmentsService } from "../../../../services/departments.service";
import type { Department } from "./type";

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const fetchDepartments = useCallback(() => {
    setLoading(true);
    departmentsService.getDepartments().then((data) => {
      setDepartments(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleDeleteDepartment = async (id: string) => {
    await departmentsService.deleteDepartment(id);
    fetchDepartments();
  };

  const filtered = departments.filter(
    (d) =>
      !q ||
      d.name.toLowerCase().includes(q.toLowerCase()) ||
      d.code.toLowerCase().includes(q.toLowerCase()),
  );

  return { departments: filtered, loading, q, setQ, handleDeleteDepartment };
}
