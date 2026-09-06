import React from "react";
import { Button, Input, PageHeader, Card } from "../../../../components/ui/Primitives";
import { useAddProduct } from "./hook";

const AddProductPage: React.FC = () => {
  const {
    loading,
    error,
    categories,
    productData,
    variants,
    handleProductChange,
    toggleCategory,
    handleVariantChange,
    addVariant,
    removeVariant,
    handleSubmit,
    onBack,
  } = useAddProduct();

  return (
    <div className="flex flex-col gap-8 max-w-4xl pb-16">
      <PageHeader
        eyebrow="Quản lý / Sản phẩm / Thêm mới"
        title="Thêm sản phẩm mới"
        description="Nhập thông tin chi tiết và các biến thể của mỹ phẩm."
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <Card className="p-8 flex flex-col gap-6">
          <h2 className="text-[20px] text-[--color-forest-depths]" style={{ fontWeight: 350 }}>
            Thông tin cơ bản
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[--color-pewter] uppercase tracking-[0.1em]">
                Tên sản phẩm *
              </label>
              <Input
                name="name"
                value={productData.name}
                onChange={handleProductChange}
                placeholder="Ví dụ: Sữa rửa mặt vi sinh DS-01"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[--color-pewter] uppercase tracking-[0.1em]">
                Thương hiệu
              </label>
              <Input
                name="brand"
                value={productData.brand}
                onChange={handleProductChange}
                placeholder="Ví dụ: Guardian"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[--color-pewter] uppercase tracking-[0.1em]">
                Xuất xứ
              </label>
              <Input
                name="origin"
                value={productData.origin}
                onChange={handleProductChange}
                placeholder="Ví dụ: Việt Nam"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[--color-pewter] uppercase tracking-[0.1em]">
                Hình ảnh (URL)
              </label>
              <Input
                name="imageUrl"
                value={productData.imageUrl}
                onChange={handleProductChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[--color-pewter] uppercase tracking-[0.1em]">
              Mô tả
            </label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleProductChange}
              rows={4}
              className="bg-transparent border-[1.5px] border-[--color-ash] rounded-[8px] px-[14px] py-[10px] text-[--color-forest-depths] placeholder:text-[--color-pewter]/50 focus:outline-none focus:border-[--color-forest-depths] transition-colors"
              placeholder="Nhập mô tả sản phẩm..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[--color-pewter] uppercase tracking-[0.1em]">
              Danh mục
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.length === 0 ? (
                <p className="text-[14px] text-[#666666]">
                  Chưa có danh mục ({categories.length}).
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
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2
              className="text-[20px] text-[--color-forest-depths]"
              style={{ fontWeight: 350 }}
            >
              Biến thể (Variants)
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariant}
            >
              + Thêm biến thể
            </Button>
          </div>

          {variants.map((variant, index) => (
            <Card
              key={index}
              className="p-6 flex flex-col gap-6 bg-transparent border-[1.5px] border-[#b3b3b3]"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#eeeee9]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1c3a13] text-[#fcfcf7] text-[10px] font-medium font-[var(--font-seed-sans-mono)]">
                    0{index + 1}
                  </span>
                  <span className="text-[16px] font-medium text-[#1c3a13]">
                    Cấu hình biến thể
                  </span>
                </div>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-[12px] uppercase tracking-[0.1em] text-[#666666] hover:text-red-600 font-medium transition-colors"
                  >
                    Xoá cấu hình
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="flex flex-col gap-2 md:col-span-6">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Tên biến thể *
                  </label>
                  <Input
                    value={variant.name}
                    onChange={(e) =>
                      handleVariantChange(index, "name", e.target.value)
                    }
                    placeholder="VD: Mặc định / 50ml / Màu Xanh"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-3">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Dung tích
                  </label>
                  <Input
                    value={variant.volume || ""}
                    onChange={(e) =>
                      handleVariantChange(index, "volume", e.target.value)
                    }
                    placeholder="VD: 50ml"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-3">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Màu sắc
                  </label>
                  <Input
                    value={variant.color || ""}
                    onChange={(e) =>
                      handleVariantChange(index, "color", e.target.value)
                    }
                    placeholder="VD: Xanh rêu"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-6">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Giá bán *
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index, "price", e.target.value)
                    }
                    className="font-[var(--font-seed-sans-mono)]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-6">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Giá gốc (tuỳ chọn)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={variant.costPrice || ""}
                    onChange={(e) =>
                      handleVariantChange(index, "costPrice", e.target.value)
                    }
                    className="font-[var(--font-seed-sans-mono)]"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="pt-8 border-t border-[--color-warm-stone] flex justify-end">
          <Button
            type="submit"
            variant="primary"
            className="min-w-[200px]"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Tạo sản phẩm"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
