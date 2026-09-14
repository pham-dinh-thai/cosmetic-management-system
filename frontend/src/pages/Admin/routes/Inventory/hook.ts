import { useEffect, useState } from "react";
import { toast } from "sonner";
import { inventoryApi, type ExpiringBatchDto } from "./api";
import type { InventoryItem } from "./type";
import { productsService } from "../../../../services/products.service";
import { suppliersService } from "../../../../services/suppliers.service";

type VariantMeta = { productName: string; variantName: string; costPrice: number | null };

export type InventoryStatusFilter = "all" | "active" | "inactive";

export interface ExpiringBatch {
  id: string;
  inventoryId: string;
  variantId: string;
  lotNumber: string;
  supplierId: string;
  supplierName?: string;
  quantity: number;
  expiredDate: string;
  productName?: string;
  variantName?: string;
}

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [expiring, setExpiring] = useState<ExpiringBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<InventoryStatusFilter>("active");

  const load = async () => {
    try {
      const [rows, cosmetics, suppliers] = await Promise.all([
        inventoryApi.fetchInventory(),
        productsService.getCosmetics(),
        suppliersService.getSuppliers(),
      ]);

      const meta = new Map<string, VariantMeta>();
      for (const c of cosmetics) {
        let variants: { id: string; name: string; costPrice?: number | null }[] = [];
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
            costPrice: v.costPrice ?? null,
          });
        }
      }

      const supplierName = new Map(suppliers.map((s) => [s.id, s.name]));

      const enriched = rows.map((r) => {
        const m = meta.get(r.variantId);
        return {
          ...r,
          productName: m?.productName || r.variantId,
          variantName: m?.variantName || "",
          costPrice: m?.costPrice ?? null,
        };
      });

      let expiringRows: ExpiringBatchDto[] = [];
      try {
        expiringRows = await inventoryApi.getExpiringBatches(30);
      } catch {
        expiringRows = [];
      }

      const expiringEnriched: ExpiringBatch[] = expiringRows.map((b) => {
        const m = meta.get(b.variantId);
        return {
          ...b,
          supplierName: supplierName.get(b.supplierId) || b.supplierId,
          productName: m?.productName || b.variantId,
          variantName: m?.variantName || "",
        };
      });

      setInventory(enriched);
      setExpiring(expiringEnriched);
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
      (status === "all" ||
        (status === "active" && i.isActive) ||
        (status === "inactive" && !i.isActive)) &&
      (!q ||
        (i.productName || "").toLowerCase().includes(q.toLowerCase()) ||
        (i.variantName || "").toLowerCase().includes(q.toLowerCase())),
  );

  return {
    inventory: filtered,
    expiring,
    loading,
    q,
    setQ,
    status,
    setStatus,
    reload,
    handleToggleStatus,
  };
}