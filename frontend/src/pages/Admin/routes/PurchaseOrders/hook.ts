import { useEffect, useState, useCallback } from "react";
import { purchaseOrdersService } from "../../../../services/purchase-orders.service";
import { suppliersService } from "../../../../services/suppliers.service";
import type { PurchaseOrder } from "./type";

function formatDate(iso?: string): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

export function usePurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const fetchOrders = useCallback(() => {
    setLoading(true);
    Promise.all([
      purchaseOrdersService.getPurchaseOrders(),
      suppliersService.getSuppliers(),
    ])
      .then(([data, suppliers]) => {
        const supplierName = new Map(suppliers.map((s) => [s.id, s.name]));
        setOrders(
          data.map((o) => ({
            id: o.id,
            code: o.code,
            supplierId: o.supplierId,
            supplierName: supplierName.get(o.supplierId) || o.supplierId,
            createdDate: formatDate(o.createdAt),
            totalAmount: o.totalAmount,
            status: o.status as PurchaseOrder["status"],
          })),
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = orders.filter(
    (o) =>
      !q ||
      o.code.toLowerCase().includes(q.toLowerCase()) ||
      o.supplierName.toLowerCase().includes(q.toLowerCase()),
  );

  return { orders: filtered, loading, q, setQ };
}