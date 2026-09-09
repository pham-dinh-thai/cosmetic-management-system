import React from "react";
import { PageHeader, Button, Card } from "../../../../components/ui/Primitives";
import { useProductDetail } from "./hook";

const ProductDetailAdminPage: React.FC = () => {
  const { product, loading, error, onBack } = useProductDetail();

  if (loading) {
    return <div className="p-8 text-[#666666]">Đang tải dữ liệu...</div>;
  }

  if (error || !product) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader
          eyebrow="Quản lý / Sản phẩm / Lỗi"
          title="Không tìm thấy sản phẩm"
          actions={
            <Button variant="outline" onClick={onBack}>
              ← Trở về
            </Button>
          }
        />
        <div className="bg-[#eeeee9] text-[#1c3a13] p-4 rounded-[16px] text-[14px]">
          {error || "Sản phẩm không tồn tại."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      <PageHeader
        eyebrow={`Quản lý / Sản phẩm / Chi tiết`}
        title={product.name}
        description={`Mã sản phẩm: ${product.code}`}
        actions={
          <Button variant="outline" onClick={onBack}>
            ← Trở về
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card className="p-8 flex flex-col gap-6">
            <h2
              className="text-[20px] text-[#1c3a13]"
              style={{ fontWeight: 350 }}
            >
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Tên sản phẩm
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {product.name}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Mã SP
                </span>
                <span className="text-[18px] font-[var(--font-seed-sans-mono)] font-medium text-[#1c3a13]">
                  {product.code}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Thương hiệu
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {product.brand || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Xuất xứ
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {product.origin || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Mô tả
                </span>
                <span className="text-[16px] font-medium leading-[1.6] text-[#1c3a13]">
                  {product.description || "—"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-8 flex flex-col gap-6">
            <h2
              className="text-[20px] text-[#1c3a13]"
              style={{ fontWeight: 350 }}
            >
              Danh sách Biến thể
            </h2>
            {product.variants.length === 0 ? (
              <span className="text-[14px] text-[#666666]">
                Chưa có biến thể nào.
              </span>
            ) : (
              <div className="flex flex-col gap-4">
                {product.variants.map((v, i) => (
                  <div
                    key={v.id}
                    className="p-6 border border-[#b3b3b3] rounded-[16px] flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-[#eeeee9]">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1c3a13] text-[#fcfcf7] text-[10px] font-medium font-[var(--font-seed-sans-mono)]">
                          0{i + 1}
                        </span>
                        <span className="text-[16px] font-medium text-[#1c3a13]">
                          {v.name}
                        </span>
                      </div>
                      {v.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] bg-[#e3ecd9] text-[#1c3a13]">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] bg-[#eeeee9] text-[#666666]">
                          Vô hiệu
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                          Giá bán
                        </span>
                        <span className="text-[16px] font-[var(--font-seed-sans-mono)] font-medium text-[#1c3a13]">
                          {v.price.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                          Giá gốc
                        </span>
                        <span className="text-[16px] font-[var(--font-seed-sans-mono)] font-medium text-[#1c3a13]">
                          {v.costPrice
                            ? v.costPrice.toLocaleString("vi-VN") + "₫"
                            : "—"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                          Dung tích
                        </span>
                        <span className="text-[16px] font-medium text-[#1c3a13]">
                          {v.volume || "—"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                          Màu sắc
                        </span>
                        <span className="text-[16px] font-medium text-[#1c3a13]">
                          {v.color || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-8">
          <Card className="p-8 flex flex-col gap-6">
            <h2
              className="text-[20px] text-[#1c3a13]"
              style={{ fontWeight: 350 }}
            >
              Hình ảnh
            </h2>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto rounded-[16px] object-cover border border-[#b3b3b3]"
              />
            ) : (
              <div className="aspect-square bg-[#eeeee9] rounded-[16px] flex items-center justify-center text-[#666666] text-[12px] uppercase tracking-[0.1em]">
                Không có ảnh
              </div>
            )}
          </Card>

          <Card className="p-8 flex flex-col gap-6">
            <h2
              className="text-[20px] text-[#1c3a13]"
              style={{ fontWeight: 350 }}
            >
              Trạng thái & Danh mục
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Trạng thái chung
                </span>
                {product.isActive ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] bg-[#e3ecd9] text-[#1c3a13]">
                    Đang bán
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] bg-[#eeeee9] text-[#666666]">
                    Ngừng bán
                  </span>
                )}
              </div>
              <div className="pt-4 border-t border-[#eeeee9] flex flex-col gap-2">
                <span className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Danh mục ID
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.categoryIds.length === 0 && (
                    <span className="text-[14px] text-[#666666]">—</span>
                  )}
                  {product.categoryIds.map((id) => (
                    <span
                      key={id}
                      className="text-[12px] font-[var(--font-seed-sans-mono)] px-2 py-1 bg-[#eeeee9] rounded-full text-[#1c3a13]"
                    >
                      {id.slice(0, 8)}...
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailAdminPage;
