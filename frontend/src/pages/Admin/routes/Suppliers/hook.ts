import { useEffect, useState, useCallback } from "react";
import { suppliersService } from "../../../../services/suppliers.service";
import type { Supplier } from "./type";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const fetchSuppliers = useCallback(() => {
    setLoading(true);
    suppliersService.getSuppliers().then((data) => {
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

  const handleDeleteSupplier = async (id: string) => {
    await suppliersService.deleteSupplier(id);
    fetchSuppliers();
  };

  const filtered = suppliers.filter(
    (s) =>
      !q ||
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.phone.includes(q) ||
      s.code.toLowerCase().includes(q.toLowerCase()),
  );

  return { suppliers: filtered, loading, q, setQ, handleDeleteSupplier };
}
