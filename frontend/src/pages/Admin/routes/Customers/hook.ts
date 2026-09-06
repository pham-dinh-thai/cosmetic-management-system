import { useEffect, useState } from "react";
import { customersApi } from "./api";
import type { Customer } from "./type";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    customersApi.fetchCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  const filtered = customers.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.phone.includes(q) ||
      c.code.toLowerCase().includes(q.toLowerCase()),
  );

  return { customers: filtered, loading, q, setQ };
}
