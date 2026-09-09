import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { departmentsService } from "../../../../services/departments.service";
import type { Department } from "./type";

export type DepartmentStatusFilter = "all" | "active" | "inactive";

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<DepartmentStatusFilter>("active");

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

  const handleToggleStatus = async (department: Department) => {
    try {
      if (department.isActive) {
        await departmentsService.deactivateDepartment(department.id);
        toast.success(`Đã vô hiệu hoá phòng ban "${department.name}"`);
      } else {
        await departmentsService.activateDepartment(department.id);
        toast.success(`Đã kích hoạt lại phòng ban "${department.name}"`);
      }
      fetchDepartments();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi đổi trạng thái phòng ban");
    }
  };

  const filtered = departments.filter(
    (d) =>
      (status === "all" ||
        (status === "active" && d.isActive) ||
        (status === "inactive" && !d.isActive)) &&
      (!q ||
        d.name.toLowerCase().includes(q.toLowerCase()) ||
        d.code.toLowerCase().includes(q.toLowerCase())),
  );

  return {
    departments: filtered,
    loading,
    q,
    setQ,
    status,
    setStatus,
    handleToggleStatus,
  };
}
