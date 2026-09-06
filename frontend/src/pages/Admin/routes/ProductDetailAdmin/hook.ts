import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productDetailApi } from "./api";
import type { CosmeticDetail } from "./type";

export function useProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = id || "";
  const navigate = useNavigate();

  const [product, setProduct] = useState<CosmeticDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!productId) return;

    setLoading(true);
    productDetailApi
      .getCosmeticById(productId)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Không thể tải thông tin sản phẩm.",
          );
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  return {
    productId,
    product,
    loading,
    error,
    onBack: () => navigate("/admin/products"),
  };
}
