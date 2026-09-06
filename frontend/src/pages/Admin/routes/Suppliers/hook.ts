import { useEffect, useState } from "react";
import { suppliersApi } from "./api";
import type { Supplier } from "./type";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    suppliersApi.fetchSuppliers().then((data) => {
      setSuppliers(data);
      setLoading(false);
    });
  }, []);

  const filtered = suppliers.filter(
    (s) =>
      !q ||
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.contactName.toLowerCase().includes(q.toLowerCase()) ||
      s.code.toLowerCase().includes(q.toLowerCase()),
  );

  return { suppliers: filtered, loading, q, setQ };
}
