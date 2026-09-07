import React, { useState } from "react";
import { Button, Input, PageHeader, Card } from "../../../../components/ui/Primitives";
import { useEditProduct } from "./hook";

const EditProductPage: React.FC = () => {
  const {
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
    onBack,
  } = useEditProduct();

  const [isHoveringImage, setIsHoveringImage] = useState(false);

  if (fetching) {
    return <div className="p-8 text-[#666666]">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Basic Info & Variants */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <form onSubmit={handleSaveProductInfo} className="flex flex-col gap-8">
            <Card className="p-8 flex flex-col gap-6">
              <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>
                Thông tin cơ bản
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Tên sản phẩm *
                  </label>
                  <Input
                    name="name"
                    value={productData.name}
                    onChange={handleProductChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Thương hiệu
                  </label>
                  <Input
                    name="brand"
                    value={productData.brand}
                    onChange={handleProductChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Xuất xứ
                  </label>
                  <Input
                    name="origin"
                    value={productData.origin}
                    onChange={handleProductChange}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleProductChange}
                    rows={4}
                    className="bg-transparent border-[1.5px] border-[#c4c7c4] rounded-[8px] px-[14px] py-[10px] text-[#1c3a13] placeholder:text-[#666666] focus:outline-none focus:border-[#1c3a13] transition-colors w-full"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Đang lưu..." : "Lưu tất cả thay đổi"}
                </Button>
              </div>
            </Card>
          </form>

          <Card className="p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>
                Quản lý Biến thể (Variants)
              </h2>
              <Button variant="outline" onClick={addNewVariantBox}>
                + Thêm biến thể mới
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              {existingVariants.map((v, i) => (
                <div
                  key={v.id}
                  className="p-6 flex flex-col gap-6 border-[1.5px] border-[#b3b3b3] rounded-[16px] bg-transparent"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-[#eeeee9]">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#eeeee9] text-[#1c3a13] text-[10px] font-medium font-[var(--font-seed-sans-mono)]">
                        0{i + 1}
                      </span>
                      <span className="text-[16px] font-medium text-[#1c3a13]">
                        Sửa cấu hình biến thể
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-[12px] uppercase tracking-[0.1em] font-medium ${
                          v.isActive ? "text-[#1c3a13]" : "text-[#666666]"
                        }`}
                      >
                        {v.isActive ? "Đang hoạt động" : "Đã vô hiệu hoá"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVariantStatus(i)}
                      >
                        {v.isActive ? "Vô hiệu hoá" : "Kích hoạt lại"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="flex flex-col gap-2 md:col-span-6">
                      <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                        Tên biến thể *
                      </label>
                      <Input
                        value={v.name}
                        onChange={(e) =>
                          handleExistingVariantChange(i, "name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-3">
                      <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                        Dung tích
                      </label>
                      <Input
                        value={v.volume || ""}
                        onChange={(e) =>
                          handleExistingVariantChange(i, "volume", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-3">
                      <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                        Màu sắc
                      </label>
                      <Input
                        value={v.color || ""}
                        onChange={(e) =>
                          handleExistingVariantChange(i, "color", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-6">
                      <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                        Giá bán *
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={v.price}
                        onChange={(e) =>
                          handleExistingVariantChange(i, "price", e.target.value)
                        }
                        className="font-[var(--font-seed-sans-mono)]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-6">
                      <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                        Giá gốc
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={v.costPrice || ""}
                        onChange={(e) =>
                          handleExistingVariantChange(i, "costPrice", e.target.value)
                        }
                        className="font-[var(--font-seed-sans-mono)]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="primary" onClick={() => saveExistingVariant(i)}>
                      Lưu cấu hình
                    </Button>
                  </div>
                </div>
              ))}

              {newVariants.map((v, i) => (
                <div
                  key={`new-${i}`}
                  className="p-6 flex flex-col gap-6 border-[1.5px] border-[#1c3a13] rounded-[16px] bg-[#e3ecd9]/20"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-[#1c3a13]/20">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1c3a13] text-[#fcfcf7] text-[10px] font-medium font-[var(--font-seed-sans-mono)]">
                        N
                      </span>
                      <span className="text-[16px] font-medium text-[#1c3a13]">
                        Thêm mới cấu hình
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewVariantBox(i)}
                      className="text-[12px] uppercase tracking-[0.1em] text-red-600 font-medium"
                    >
                      Hủy bỏ
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="flex flex-col gap-2 md:col-span-6">
                      <label className="text-[12px] font-medium text-[#1c3a13] uppercase tracking-[0.1em]">
                        Tên biến thể *
                      </label>
                      <Input
                        value={v.name}
                        onChange={(e) =>
                          handleNewVariantChange(i, "name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-3">
                      <label className="text-[12px] font-medium text-[#1c3a13] uppercase tracking-[0.1em]">
                        Dung tích
                      </label>
                      <Input
                        value={v.volume || ""}
                        onChange={(e) =>
                          handleNewVariantChange(i, "volume", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-3">
                      <label className="text-[12px] font-medium text-[#1c3a13] uppercase tracking-[0.1em]">
                        Màu sắc
                      </label>
                      <Input
                        value={v.color || ""}
                        onChange={(e) =>
                          handleNewVariantChange(i, "color", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-6">
                      <label className="text-[12px] font-medium text-[#1c3a13] uppercase tracking-[0.1em]">
                        Giá bán *
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={v.price}
                        onChange={(e) =>
                          handleNewVariantChange(i, "price", e.target.value)
                        }
                        className="font-[var(--font-seed-sans-mono)]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-6">
                      <label className="text-[12px] font-medium text-[#1c3a13] uppercase tracking-[0.1em]">
                        Giá gốc
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={v.costPrice || ""}
                        onChange={(e) =>
                          handleNewVariantChange(i, "costPrice", e.target.value)
                        }
                        className="font-[var(--font-seed-sans-mono)]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="primary" onClick={() => saveNewVariant(i)}>
                      Tạo biến thể
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Image & Status */}
        <div className="flex flex-col gap-8">
          <Card className="p-8 flex flex-col gap-6">
            <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>
              Hình ảnh
            </h2>
            
            <div 
              className="relative rounded-[16px] overflow-hidden border border-[#b3b3b3] group cursor-pointer"
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
            >
              {productData.imageUrl ? (
                <img
                  src={productData.imageUrl}
                  alt={productData.name}
                  className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-60"
                />
              ) : (
                <div className="aspect-square bg-[#eeeee9] flex items-center justify-center text-[#666666] text-[12px] uppercase tracking-[0.1em] transition-opacity duration-300 group-hover:opacity-40">
                  Không có ảnh
                </div>
              )}
              
              <div 
                className={`absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 bg-black/60 transition-opacity duration-300 ${
                  isHoveringImage ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
              >
                <span className="text-[#fcfcf7] font-medium uppercase tracking-[0.1em] text-[12px]">
                  {imageSaving ? "Đang tải ảnh lên..." : "Cập nhật ảnh sản phẩm"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={imageSaving}
                  onChange={(e) => handleImageUpload(e.target.files?.[0])}
                  className="w-full rounded-lg border border-[#c4c7c4] bg-[#fcfcf7] px-4 py-2.5 text-[14px] text-[#1c3a13] file:mr-4 file:cursor-pointer file:border-0 file:bg-[#1c3a13] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#fcfcf7] hover:file:opacity-90 focus:outline-none focus:border-[#1c3a13] transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={handleSaveImageOnly} 
              disabled={imageSaving}
              className="w-full mt-2"
            >
              {imageSaving ? "Đang lưu..." : "Lưu Hình Ảnh"}
            </Button>
          </Card>

          <Card className="p-8 flex flex-col gap-6">
            <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>
              Danh mục
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.length === 0 ? (
                <p className="text-[14px] text-[#666666]">
                  Chưa có danh mục nào trên hệ thống.
                </p>
              ) : (
                categories.map((cat) => {
                  const isSelected = (productData.categoryIds || []).includes(
                    cat.id,
                  );
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleCategory(cat.id);
                      }}
                      className={`px-4 py-2 rounded-full text-[14px] border-[1.5px] transition-colors ${
                        isSelected
                          ? "bg-[#1c3a13] border-[#1c3a13] text-[#fcfcf7]"
                          : "bg-transparent border-[#b3b3b3] text-[#666666] hover:border-[#1c3a13]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
