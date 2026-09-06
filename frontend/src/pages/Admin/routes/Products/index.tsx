import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Button, Input, Select } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { ConfirmModal } from "../../../../components/ui/ConfirmModal";
import { useProducts } from "./hook";
import type { CosmeticSummary, StatusFilter } from "./type";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang bán" },
  { value: "inactive", label: "Ngừng bán" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "name", label: "Theo tên A → Z" },
  { value: "variants", label: "Nhiều biến thể trước" },
];

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
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
  } = useProducts();

  const columns: Column<CosmeticSummary>[] = useMemo(
    () => [
      {
        key: "code",
        header: "Mã SP",
        render: (p) => (
          <span className="font-medium uppercase tracking-[0.06em] text-[12px]">
            {p.code}
          </span>
        ),
      },
      {
        key: "name",
        header: "Sản phẩm",
        render: (p) => (
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-medium text-[#1c3a13]">{p.name}</span>
            {p.description && (
              <span className="text-[12px] text-[#666666] truncate max-w-[320px]">
                {p.description}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "brand",
        header: "Thương hiệu",
        render: (p) => <span className="text-[#666666]">{p.brand ?? "—"}</span>,
      },
      {
        key: "origin",
        header: "Xuất xứ",
        render: (p) => <span className="text-[#666666]">{p.origin ?? "—"}</span>,
      },
      {
        key: "variantCount",
        header: "Biến thể",
        render: (p) => <span className="text-[#666666]">{p.variantCount}</span>,
      },
      {
        key: "isActive",
        header: "Trạng thái",
        render: (p) =>
          p.isActive ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] bg-[#e3ecd9] text-[#1c3a13]">
              Đang bán
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] bg-[#eeeee9] text-[#666666]">
              Ngừng bán
            </span>
          ),
      },
      {
        key: "actions",
        header: "Hành động",
        className: "text-right",
        render: (p) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/admin/products/${p.id}`)}
            >
              Xem chi tiết
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/products/${p.id}/edit`)}
            >
              Sửa
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50/80"
              disabled={deletingId === p.id}
              onClick={() => setConfirmDelete({ isOpen: true, product: p })}
            >
              Xoá
            </Button>
          </div>
        ),
      },
    ],
    [navigate, deletingId, setConfirmDelete],
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Sản phẩm"
        title="Sản phẩm"
        description="Danh mục mỹ phẩm Guardian — sữa rửa mặt, tinh chất, kem dưỡng và các sản phẩm chăm sóc da chuyên sâu."
        actions={
          <Button variant="primary" onClick={() => navigate("/admin/products/add")}>
            + Thêm sản phẩm
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6">
          <Input
            placeholder="Tìm kiếm sản phẩm theo mã, tên, thương hiệu…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            options={STATUS_OPTIONS}
          />
        </div>
        <div className="md:col-span-3">
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-[16px] border border-[#eeeee9] overflow-hidden animate-pulse">
          <div className="h-[48px] bg-[#eeeee9]" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[64px] border-t border-[#eeeee9] bg-[#fcfcf7]"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[16px] border border-[#eeeee9] bg-[#fcfcf7] py-12 text-center text-[14px] text-[#666666]">
          {error}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(p) => p.id}
          empty="Không tìm thấy sản phẩm phù hợp"
        />
      )}

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xoá sản phẩm"
        message={`Bạn có chắc chắn muốn xoá sản phẩm "${confirmDelete.product?.name}" (${confirmDelete.product?.code})? Hành động này không thể hoàn tác.`}
        confirmText="Xoá sản phẩm"
        cancelText="Hủy"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ isOpen: false, product: null })}
      />
    </div>
  );
};

export default ProductsPage;
