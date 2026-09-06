import React, { useEffect, useState } from "react";
import { Button, Input, PageHeader, Card } from "../../../components/ui/Primitives";
import { 
  productsService, 
  type UpdateCosmeticPayload,
  type CategorySummary,
  type CosmeticDetailVariant,
  type CreateVariantPayload,
  type UpdateVariantPayload
} from "../../../services/products.service";
import { toast } from "sonner";

interface EditProductProps {
  productId: string;
  onBack: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({ productId, onBack }) => {
  const [loading, setLoading] = useState(false);
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
    setFetching(true);
    try {
      const [product, cats] = await Promise.all([
        productsService.getCosmeticById(productId),
        productsService.getCategories()
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
      setError(err?.response?.data?.message || "Không thể tải thông tin sản phẩm để sửa.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [productId]);

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const toggleCategory = (id: string) => {
    setProductData(prev => {
      const currentCategories = prev.categoryIds || [];
      return {
        ...prev,
        categoryIds: currentCategories.includes(id)
          ? currentCategories.filter(c => c !== id)
          : [...currentCategories, id]
      };
    });
  };

  const handleExistingVariantChange = (index: number, field: keyof CosmeticDetailVariant, value: any) => {
    const arr = [...existingVariants];
    arr[index] = { ...arr[index], [field]: value };
    setExistingVariants(arr);
  };

  const handleNewVariantChange = (index: number, field: keyof CreateVariantPayload, value: any) => {
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
      await productsService.updateCosmetic(productId, payload);
      toast.success("Đã lưu thông tin chung & danh mục thành công!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin chung.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
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
      await productsService.updateVariant(v.id, payload);
      toast.success(`Đã lưu cấu hình "${v.name}"!`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi lưu cấu hình.");
    }
  };

  const toggleVariantStatus = async (index: number) => {
    const v = existingVariants[index];
    try {
      if (v.isActive) {
        await productsService.deactivateVariant(v.id);
        toast.success(`Đã vô hiệu hoá "${v.name}"`);
      } else {
        await productsService.activateVariant(v.id);
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
      await productsService.addVariant(productId, payload);
      toast.success("Đã thêm biến thể mới!");
      loadData();
      setNewVariants(newVariants.filter((_, i) => i !== index));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi thêm biến thể mới.");
    }
  };

  if (fetching) {
    return <div className="p-8 text-[#666666]">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl pb-16">
      <PageHeader
        eyebrow="Quản lý / Sản phẩm / Sửa"
        title="Sửa thông tin sản phẩm"
        description="Quản lý thông tin chung, danh mục và các biến thể."
        actions={
          <Button variant="ghost" onClick={onBack}>
            ← Trở về
          </Button>
        }
      />

      {error && (
        <div className="bg-[#eeeee9] text-[#1c3a13] p-4 rounded-[16px] text-[14px]">
          {error}
        </div>
      )}

      {/* Thông tin chung */}
      <form onSubmit={handleSaveProductInfo} className="flex flex-col gap-8">
        <Card className="p-8 flex flex-col gap-6">
          <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>Thông tin cơ bản & Danh mục</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">Tên sản phẩm *</label>
              <Input name="name" value={productData.name} onChange={handleProductChange} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">Thương hiệu</label>
              <Input name="brand" value={productData.brand} onChange={handleProductChange} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">Xuất xứ</label>
              <Input name="origin" value={productData.origin} onChange={handleProductChange} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">Hình ảnh (URL)</label>
              <Input name="imageUrl" value={productData.imageUrl} onChange={handleProductChange} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">Mô tả</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleProductChange}
              rows={4}
              className="bg-transparent border-[1.5px] border-[#c4c7c4] rounded-[8px] px-[14px] py-[10px] text-[#1c3a13] placeholder:text-[#666666] focus:outline-none focus:border-[#1c3a13] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">Danh mục</label>
            <div className="flex flex-wrap gap-2">
              {categories.length === 0 ? (
                <p className="text-[14px] text-[#666666]">Chưa có danh mục nào trên hệ thống.</p>
              ) : (
                categories.map(cat => {
                  const isSelected = (productData.categoryIds || []).includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={(e) => { e.preventDefault(); toggleCategory(cat.id); }}
                      className={`px-4 py-2 rounded-full text-[14px] border-[1.5px] transition-colors ${
                        isSelected ? "bg-[#1c3a13] border-[#1c3a13] text-[#fcfcf7]" : "bg-transparent border-[#b3b3b3] text-[#666666] hover:border-[#1c3a13]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={loading}>{loading ? "Đang lưu..." : "Lưu Thông Tin Cơ Bản"}</Button>
          </div>
        </Card>
      </form>

      {/* Quản lý biến thể */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>Quản lý Biến thể (Variants)</h2>
          <Button variant="outline" onClick={addNewVariantBox}>+ Thêm biến thể mới</Button>
        </div>

        {/* Existing Variants */}
        {existingVariants.map((v, i) => (
          <Card key={v.id} className="p-6 flex flex-col gap-6 border-[1.5px] border-[#b3b3b3] bg-transparent">
            <div className="flex justify-between items-center pb-4 border-b border-[#eeeee9]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#eeeee9] text-[#1c3a13] text-[10px] font-medium font-[var(--font-seed-sans-mono)]">
                  0{i + 1}
                </span>
                <span className="text-[16px] font-medium text-[#1c3a13]">Sửa cấu hình biến thể</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[12px] uppercase tracking-[0.1em] font-medium ${v.isActive ? 'text-[#1c3a13]' : 'text-[#666666]'}`}>
                  {v.isActive ? "Đang hoạt động" : "Đã vô hiệu hoá"}
                </span>
                <Button variant="ghost" size="sm" onClick={() => toggleVariantStatus(i)}>
                  {v.isActive ? "Vô hiệu hoá" : "Kích hoạt lại"}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="flex flex-col gap-2 md:col-span-6">
                <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">Tên biến thể *</label>
                <Input value={v.name} onChange={e => handleExistingVariantChange(i, "name", e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">Dung tích</label>
                <Input value={v.volume || ""} onChange={e => handleExistingVariantChange(i, "volume", e.target.value)} />
              </div>
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">Màu sắc</label>
                <Input value={v.color || ""} onChange={e => handleExistingVariantChange(i, "color", e.target.value)} />
              </div>
              <div className="flex flex-col gap-2 md:col-span-6">
                <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">Giá bán *</label>
                <Input type="number" min={0} value={v.price} onChange={e => handleExistingVariantChange(i, "price", e.target.value)} className="font-[var(--font-seed-sans-mono)]" required />
              </div>
              <div className="flex flex-col gap-2 md:col-span-6">
                <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">Giá gốc</label>
                <Input type="number" min={0} value={v.costPrice || ""} onChange={e => handleExistingVariantChange(i, "costPrice", e.target.value)} className="font-[var(--font-seed-sans-mono)]" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => saveExistingVariant(i)}>Lưu cấu hình</Button>
            </div>
          </Card>
        ))}

        {/* New Variants */}
        {newVariants.map((v, i) => (
          <Card key={`new-${i}`} className="p-6 flex flex-col gap-6 border-[1.5px] border-[#1c3a13] bg-[#e3ecd9]/20">
            <div className="flex justify-between items-center pb-4 border-b border-[#1c3a13]/20">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1c3a13] text-[#fcfcf7] text-[10px] font-medium font-[var(--font-seed-sans-mono)]">
                  N
                </span>
                <span className="text-[16px] font-medium text-[#1c3a13]">Thêm mới cấu hình</span>
              </div>
              <button type="button" onClick={() => removeNewVariantBox(i)} className="text-[12px] uppercase tracking-[0.1em] text-red-600 font-medium">Hủy bỏ</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="flex flex-col gap-2 md:col-span-6">
                <label className="text-[12px] font-medium text-[#1c3a13] uppercase tracking-[0.1em]">Tên biến thể *</label>
                <Input value={v.name} onChange={e => handleNewVariantChange(i, "name", e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-[12px] font-medium text-[#1c3a13] uppercase tracking-[0.1em]">Dung tích</label>
                <Input value={v.volume || ""} onChange={e => handleNewVariantChange(i, "volume", e.target.value)} />
              </div>
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-[12px] font-medium text-[#1c3a13] uppercase tracking-[0.1em]">Màu sắc</label>
                <Input value={v.color || ""} onChange={e => handleNewVariantChange(i, "color", e.target.value)} />
              </div>
              <div className="flex flex-col gap-2 md:col-span-6">
                <label className="text-[12px] font-medium text-[#1c3a13] uppercase tracking-[0.1em]">Giá bán *</label>
                <Input type="number" min={0} value={v.price} onChange={e => handleNewVariantChange(i, "price", e.target.value)} className="font-[var(--font-seed-sans-mono)]" required />
              </div>
              <div className="flex flex-col gap-2 md:col-span-6">
                <label className="text-[12px] font-medium text-[#1c3a13] uppercase tracking-[0.1em]">Giá gốc</label>
                <Input type="number" min={0} value={v.costPrice || ""} onChange={e => handleNewVariantChange(i, "costPrice", e.target.value)} className="font-[var(--font-seed-sans-mono)]" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => saveNewVariant(i)}>Tạo biến thể</Button>
            </div>
          </Card>
        ))}

      </div>
    </div>
  );
};

export default EditProduct;
