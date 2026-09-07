import { useEffect, useState } from "react";
import { addProductApi } from "./api";
import type { CategorySummary, CreateVariantPayload } from "./type";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useAddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);

  useEffect(() => {
    addProductApi
      .getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    origin: "",
    description: "",
    imageUrl: "",
    categoryIds: [] as string[],
  });

  const [variants, setVariants] = useState<CreateVariantPayload[]>([
    { name: "Mặc định", price: 0, color: "", volume: "", costPrice: 0 },
  ]);

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const { imageUrl } = await addProductApi.uploadImage(file);
      setProductData((prev) => ({ ...prev, imageUrl }));
    } catch {
      setError("Tải ảnh sản phẩm lên thất bại. Vui lòng thử lại.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const toggleCategory = (id: string) => {
    setProductData((prev) => {
      const currentCategories = prev.categoryIds || [];
      return {
        ...prev,
        categoryIds: currentCategories.includes(id)
          ? currentCategories.filter((c) => c !== id)
          : [...currentCategories, id],
      };
    });
  };

  const handleVariantChange = (
    index: number,
    field: keyof CreateVariantPayload,
    value: string | number,
  ) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { name: "", price: 0, color: "", volume: "", costPrice: 0 },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!productData.name) {
      setError("Tên sản phẩm không được để trống.");
      return;
    }
    for (const v of variants) {
      if (!v.name) {
        setError("Tên biến thể không được để trống.");
        return;
      }
      if (v.price < 0) {
        setError("Giá bán biến thể không hợp lệ.");
        return;
      }
    }

    setLoading(true);
    try {
      await addProductApi.createCosmetic({
        name: productData.name,
        brand: productData.brand || undefined,
        origin: productData.origin || undefined,
        description: productData.description || undefined,
        imageUrl: productData.imageUrl || undefined,
        categoryIds: productData.categoryIds,
        variants: variants.map((v) => ({
          name: v.name,
          price: Number(v.price),
          color: v.color || undefined,
          volume: v.volume || undefined,
          costPrice: v.costPrice ? Number(v.costPrice) : undefined,
        })),
      });
      toast.success("Đã thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Đã xảy ra lỗi khi tạo sản phẩm.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    categories,
    productData,
    variants,
    uploadingImage,
    handleProductChange,
    handleImageUpload,
    toggleCategory,
    handleVariantChange,
    addVariant,
    removeVariant,
    handleSubmit,
    onBack: () => navigate("/admin/products"),
  };
}
