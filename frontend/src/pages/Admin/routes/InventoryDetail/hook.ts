import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { inventoryApi } from "../Inventory/api";
import { productsService } from "../../../../services/products.service";
import { employeesService, combineName } from "../../../../services/employees.service";
import { useBasePath } from "../../../../lib/useBasePath";
import type { InventoryItem } from "../Inventory/type";

export function useInventoryDetail() {
  const { id } = useParams<{ id: string }>();
  const inventoryId = id || "";
  const navigate = useNavigate();
  const basePath = useBasePath();

  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        let createdByName = "";
        if (row.createdBy) {
          try {
            const employees = await employeesService.getEmployees();
            const creator = employees.find(
              (e) => e.userId === row.createdBy,
            );
            createdByName = creator
              ? combineName(creator.firstName, creator.lastName)
              : "";
          } catch {
            createdByName = "";
          }
        }

        if (!cancelled) {
          setItem({ ...row, productName, variantName, createdByName });
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

  return {
    inventoryId,
    item,
    loading,
    error,
    onBack: () => navigate(`${basePath}/inventory`),
  };
}