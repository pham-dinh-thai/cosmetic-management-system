import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { suppliersService } from "../../../../services/suppliers.service";
import type { Supplier } from "./type";

export type SupplierStatusFilter = "all" | "active" | "inactive";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<SupplierStatusFilter>("active");

  const fetchSuppliers = useCallback(() => {
    setLoading(true);
    suppliersService.getSuppliers(undefined, true).then((data) => {
      setSuppliers(
        data.map((s) => ({
          id: s.id,
          code: s.code,
          name: s.name,
          phone: s.phone || "",
          email: s.email,
          address: s.address || "",
          isActive: s.isActive,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        })),
      );
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleToggleStatus = async (supplier: Supplier) => {
    try {
      if (supplier.isActive) {
        await suppliersService.deactivateSupplier(supplier.id);
        toast.success(`Đã vô hiệu hoá nhà cung cấp "${supplier.name}"`);
      } else {
        await suppliersService.activateSupplier(supplier.id);
        toast.success(`Đã kích hoạt lại nhà cung cấp "${supplier.name}"`);
      }
      fetchSuppliers();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi đổi trạng thái nhà cung cấp");
    }
  };

  const filtered = suppliers.filter(
    (s) =>
      (status === "all" ||
        (status === "active" && s.isActive) ||
        (status === "inactive" && !s.isActive)) &&
      (!q ||
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.phone.includes(q) ||
        s.code.toLowerCase().includes(q.toLowerCase())),
  );

  return {
    suppliers: filtered,
    loading,
    q,
    setQ,
    status,
    setStatus,
    handleToggleStatus,
  };
}
