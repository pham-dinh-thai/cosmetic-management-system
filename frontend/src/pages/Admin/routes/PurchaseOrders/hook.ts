import { useEffect, useState } from "react";
import { purchaseOrdersApi } from "./api";
import type { PurchaseOrder } from "./type";

export function usePurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    purchaseOrdersApi.fetchOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const filtered = orders.filter(
    (o) =>
      !q ||
      o.code.toLowerCase().includes(q.toLowerCase()) ||
      o.supplierName.toLowerCase().includes(q.toLowerCase()),
  );

  return { orders: filtered, loading, q, setQ };
}
