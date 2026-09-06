import { useEffect, useState } from "react";
import { inventoryApi } from "./api";
import type { InventoryItem } from "./type";

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    inventoryApi.fetchInventory().then((data) => {
      setInventory(data);
      setLoading(false);
    });
  }, []);

  const filtered = inventory.filter(
    (i) =>
      !q ||
      i.productName.toLowerCase().includes(q.toLowerCase()) ||
      i.sku.toLowerCase().includes(q.toLowerCase()) ||
      i.variantName.toLowerCase().includes(q.toLowerCase()),
  );

  return { inventory: filtered, loading, q, setQ };
}
