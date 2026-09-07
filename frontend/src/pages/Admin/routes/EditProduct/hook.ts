import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { editProductApi } from "./api";
import type {
  CategorySummary,
  CosmeticDetailVariant,
  CreateVariantPayload,
  UpdateCosmeticPayload,
  UpdateVariantPayload,
} from "./type";
import { toast } from "sonner";

export function useEditProduct() {
  const { id } = useParams<{ id: string }>();
  const productId = id || "";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imageSaving, setImageSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);

  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    origin: "",
    description: "",
    imageUrl: "",
    categoryIds: [] as string[],
  });

  const [existingVariants, setExistingVariants] = useState<CosmeticDetailVariant[]>([]);
  const [newVariants, setNewVariants] = useState<CreateVariantPayload[]>([]);

  const loadData = async () => {
    if (!productId) return;
    setFetching(true);
    try {
      const [product, cats] = await Promise.all([
        editProductApi.getCosmeticById(productId),
        editProductApi.getCategories(),
      ]);
      setProductData({
        name: product.name || "",
        brand: product.brand || "",
        origin: product.origin || "",
        description: product.description || "",
        imageUrl: product.imageUrl || "",
        categoryIds: product.categoryIds || [],
      });
      setExistingVariants(product.variants || []);
      setCategories(cats);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Không thể tải thông tin sản phẩm để sửa.",
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [productId]);

  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const toggleCategory = (catId: string) => {
    setProductData((prev) => {
      const currentCategories = prev.categoryIds || [];
      return {
        ...prev,
        categoryIds: currentCategories.includes(catId)
          ? currentCategories.filter((c) => c !== catId)
          : [...currentCategories, catId],
      };
    });
  };

  const handleExistingVariantChange = (
    index: number,
    field: keyof CosmeticDetailVariant,
    value: any,
  ) => {
    const arr = [...existingVariants];
    arr[index] = { ...arr[index], [field]: value };
    setExistingVariants(arr);
  };

  const handleNewVariantChange = (
    index: number,
    field: keyof CreateVariantPayload,
    value: any,
  ) => {
    const arr = [...newVariants];
    arr[index] = { ...arr[index], [field]: value };
    setNewVariants(arr);
  };

  const handleSaveProductInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!productData.name) {
      setError("Tên sản phẩm không được để trống.");
      return;
    }
    setLoading(true);
    try {
      const payload: UpdateCosmeticPayload = {
        name: productData.name,
        brand: productData.brand || undefined,
        origin: productData.origin || undefined,
        description: productData.description || undefined,
        imageUrl: productData.imageUrl || undefined,
        categoryIds: productData.categoryIds,
      };
      await editProductApi.updateCosmetic(productId, payload);
      toast.success("Đã lưu thông tin chung & danh mục thành công!");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Đã xảy ra lỗi khi cập nhật thông tin chung.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File | undefined) => {
    if (!file) return;
    setImageSaving(true);
    setError(null);
    try {
      const { imageUrl } = await editProductApi.uploadImage(file);
      setProductData((prev) => ({ ...prev, imageUrl }));
      toast.success("Đã tải ảnh lên. Nhấn 'Lưu Hình Ảnh' để cập nhật.");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Lỗi khi tải ảnh lên.";
      toast.error(msg);
    } finally {
      setImageSaving(false);
    }
  };

  const handleSaveImageOnly = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!productData.name) {
      toast.error("Tên sản phẩm không được để trống.");
      return;
    }
    setImageSaving(true);
    try {
      const payload: UpdateCosmeticPayload = {
        name: productData.name,
        brand: productData.brand || undefined,
        origin: productData.origin || undefined,
        description: productData.description || undefined,
        imageUrl: productData.imageUrl || undefined,
        categoryIds: productData.categoryIds,
      };
      await editProductApi.updateCosmetic(productId, payload);
      toast.success("Đã lưu hình ảnh mới thành công!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Lỗi khi lưu hình ảnh.";
      toast.error(msg);
    } finally {
      setImageSaving(false);
    }
  };

  const saveExistingVariant = async (index: number) => {
    const v = existingVariants[index];
    try {
      const payload: UpdateVariantPayload = {
        name: v.name,
        price: Number(v.price),
        costPrice: v.costPrice ? Number(v.costPrice) : undefined,
        volume: v.volume || undefined,
        color: v.color || undefined,
      };
      await editProductApi.updateVariant(v.id, payload);
      toast.success(`Đã lưu cấu hình "${v.name}"!`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi lưu cấu hình.");
    }
  };

  const toggleVariantStatus = async (index: number) => {
    const v = existingVariants[index];
    try {
      if (v.isActive) {
        await editProductApi.deactivateVariant(v.id);
        toast.success(`Đã vô hiệu hoá "${v.name}"`);
      } else {
        await editProductApi.activateVariant(v.id);
        toast.success(`Đã kích hoạt lại "${v.name}"`);
      }
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi đổi trạng thái.");
    }
  };

  const addNewVariantBox = () => {
    setNewVariants([...newVariants, { name: "", price: 0 }]);
  };

  const removeNewVariantBox = (index: number) => {
    setNewVariants(newVariants.filter((_, i) => i !== index));
  };

  const saveNewVariant = async (index: number) => {
    const v = newVariants[index];
    if (!v.name || !v.price) {
      toast.error("Vui lòng điền đủ Tên và Giá bán cho biến thể mới.");
      return;
    }
    try {
      const payload: CreateVariantPayload = {
        name: v.name,
        price: Number(v.price),
        costPrice: v.costPrice ? Number(v.costPrice) : undefined,
        volume: v.volume || undefined,
        color: v.color || undefined,
      };
      await editProductApi.addVariant(productId, payload);
      toast.success("Đã thêm biến thể mới!");
      loadData();
      setNewVariants(newVariants.filter((_, i) => i !== index));
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Lỗi khi thêm biến thể mới.",
      );
    }
  };

  return {
    productId,
    loading,
    fetching,
    imageSaving,
    error,
    categories,
    productData,
    existingVariants,
    newVariants,
    handleProductChange,
    toggleCategory,
    handleExistingVariantChange,
    handleNewVariantChange,
    handleSaveProductInfo,
    handleSaveImageOnly,
    handleImageUpload,
    saveExistingVariant,
    toggleVariantStatus,
    addNewVariantBox,
    removeNewVariantBox,
    saveNewVariant,
    onBack: () => navigate("/admin/products"),
  };
}
