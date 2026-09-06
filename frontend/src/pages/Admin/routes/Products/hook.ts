import { useCallback, useEffect, useMemo, useState } from "react";
import { productsApi } from "./api";
import type { CosmeticSummary, StatusFilter } from "./type";
import { toast } from "sonner";

export function useProducts() {
  const [products, setProducts] = useState<CosmeticSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState("newest");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    product: CosmeticSummary | null;
  }>({ isOpen: false, product: null });

  const loadProducts = useCallback(() => {
    productsApi
      .getCosmetics()
      .then((data) => setProducts(data))
      .catch(() => setError("Không thể tải danh sách sản phẩm."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    let list = products.filter(
      (p) =>
        (status === "all" ||
          (status === "active" && p.isActive) ||
          (status === "inactive" && !p.isActive)) &&
        (!k ||
          p.code.toLowerCase().includes(k) ||
          p.name.toLowerCase().includes(k) ||
          (p.brand ?? "").toLowerCase().includes(k) ||
          (p.origin ?? "").toLowerCase().includes(k)),
    );

    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "variants") {
      list = [...list].sort((a, b) => b.variantCount - a.variantCount);
    } else {
      list = [...list].sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      );
    }

    return list;
  }, [products, q, status, sort]);

  const handleDeleteConfirm = async () => {
    if (!confirmDelete.product) return;
    const p = confirmDelete.product;
    setConfirmDelete({ isOpen: false, product: null });
    setDeletingId(p.id);
    try {
      await productsApi.deleteCosmetic(p.id);
      setProducts((prev) => prev.filter((item) => item.id !== p.id));
      toast.success(`Đã xoá sản phẩm "${p.name}" thành công!`);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || `Không thể xoá sản phẩm "${p.name}".`,
      );
    } finally {
      setDeletingId(null);
    }
  };

  return {
    products,
    filtered,
    loading,
    error,
    q,
    setQ,
    status,
    setStatus,
    sort,
    setSort,
    deletingId,
    confirmDelete,
    setConfirmDelete,
    handleDeleteConfirm,
  };
}
