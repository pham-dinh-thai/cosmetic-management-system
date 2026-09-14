import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { inventoryApi } from "../Inventory/api";
import { productsService } from "../../../../services/products.service";
import { suppliersService } from "../../../../services/suppliers.service";
import { useBasePath } from "../../../../lib/useBasePath";
import { toast } from "sonner";
import type { InventoryBatch, InventoryItem } from "../Inventory/type";

export function useInventoryDetail() {
  const { id } = useParams<{ id: string }>();
  const inventoryId = id || "";
  const navigate = useNavigate();
  const basePath = useBasePath();

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!inventoryId) return;

    setLoading(true);
    (async () => {
      try {
        const row = await inventoryApi.getById(inventoryId);

        let productName = row.variantId;
        let variantName = "";
        try {
          const cosmetics = await productsService.getCosmetics();
          for (const c of cosmetics) {
            const detail = await productsService.getCosmeticById(c.id);
            const variant = detail.variants.find(
              (v) => v.id === row.variantId,
            );
            if (variant) {
              productName = c.name;
              variantName = variant.name;
              break;
            }
          }
        } catch {
          productName = row.variantId;
        }

        const supplierMap = new Map<string, string>();
        try {
          const suppliers = await suppliersService.getSuppliers();
          suppliers.forEach((s) => supplierMap.set(s.id, s.name));
        } catch {
          // không bắt buộc, hiển thị fallback supplierId
        }

        const batches: InventoryBatch[] = row.batches.map((b) => ({
          ...b,
          supplierName: supplierMap.get(b.supplierId) || b.supplierId,
        }));

        if (!cancelled) {
          setItem({ ...row, productName, variantName, batches });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Không thể tải dữ liệu dòng tồn kho.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [inventoryId]);

  const handleToggleBatch = async (batch: InventoryBatch) => {
    if (!inventoryId || saving) return;
    setSaving(true);
    try {
      if (batch.isActive) {
        await inventoryApi.deactivateBatch(inventoryId, batch.id);
        toast.success(`Đã vô hiệu hoá lô "${batch.lotNumber}"`);
      } else {
        await inventoryApi.activateBatch(inventoryId, batch.id);
        toast.success(`Đã kích hoạt lại lô "${batch.lotNumber}"`);
      }
      setItem((prev) =>
        prev
          ? {
              ...prev,
              batches: prev.batches.map((b) =>
                b.id === batch.id ? { ...b, isActive: !b.isActive } : b,
              ),
            }
          : prev,
      );
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi đổi trạng thái lô hàng");
    } finally {
      setSaving(false);
    }
  };

  return {
    inventoryId,
    item,
    loading,
    error,
    saving,
    handleToggleBatch,
    onBack: () => navigate(`${basePath}/inventory`),
  };
}