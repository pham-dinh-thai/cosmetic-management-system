import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { inventoryApi } from "../Inventory/api";
import { productsService } from "../../../../services/products.service";
import { employeesService, combineName } from "../../../../services/employees.service";
import { useBasePath } from "../../../../lib/useBasePath";
import type { InventoryItem } from "../Inventory/type";
import { useAuthStore } from "../../../../store/useAuthStore";

export function useInventoryDetail() {
  const { id } = useParams<{ id: string }>();
  const inventoryId = id || "";
  const navigate = useNavigate();
  const basePath = useBasePath();
  const currentUser = useAuthStore((state) => state.user);

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
          if (currentUser?.id === row.createdBy) {
            createdByName = combineName(
              currentUser.firstName,
              currentUser.lastName,
            ) || currentUser.email;
          }

          try {
            const employees = await employeesService.getEmployees();
            const creator = employees.find(
              (e) => e.userId === row.createdBy || e.id === row.createdBy,
            );
            createdByName = creator
              ? combineName(creator.firstName, creator.lastName)
              : createdByName;
          } catch {
            // The employee endpoint is admin-only. Keep the current user's
            // local profile name when the lookup is not available.
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
  }, [inventoryId, currentUser]);

  return {
    inventoryId,
    item,
    loading,
    error,
    onBack: () => navigate(`${basePath}/inventory`),
  };
}
