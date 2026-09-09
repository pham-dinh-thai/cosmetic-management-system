import { useEffect, useState } from "react";
import { toast } from "sonner";
import { inventoryApi } from "./api";
import type { InventoryItem } from "./type";
import { productsService } from "../../../../services/products.service";

type VariantMeta = { productName: string; variantName: string };

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = async () => {
    try {
      const [rows, cosmetics] = await Promise.all([
        inventoryApi.fetchInventory(),
        productsService.getCosmetics(),
      ]);

      const meta = new Map<string, VariantMeta>();
      for (const c of cosmetics) {
        let variants: { id: string; name: string }[] = [];
        try {
          const detail = await productsService.getCosmeticById(c.id);
          variants = detail.variants;
        } catch {
          variants = [];
        }
        for (const v of variants) {
          meta.set(v.id, {
            productName: c.name,
            variantName: v.name,
          });
        }
      }

      const enriched = rows.map((r) => {
        const m = meta.get(r.variantId);
        return {
          ...r,
          productName: m?.productName || r.variantId,
          variantName: m?.variantName || "",
        };
      });

      setInventory(enriched);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải dữ liệu tồn kho");
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const reload = () => {
    load();
  };

  const handleToggleStatus = async (item: InventoryItem) => {
    try {
      if (item.isActive) {
        await inventoryApi.deactivateInventory(item.id);
        toast.success(`Đã vô hiệu hoá dòng tồn kho "${item.variantId}"`);
      } else {
        await inventoryApi.activateInventory(item.id);
        toast.success(`Đã kích hoạt lại dòng tồn kho "${item.variantId}"`);
      }
      reload();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi đổi trạng thái tồn kho");
    }
  };

  const filtered = inventory.filter(
    (i) =>
      !q ||
      (i.productName || "").toLowerCase().includes(q.toLowerCase()) ||
      (i.variantName || "").toLowerCase().includes(q.toLowerCase()),
  );

  return { inventory: filtered, loading, q, setQ, reload, handleToggleStatus };
}