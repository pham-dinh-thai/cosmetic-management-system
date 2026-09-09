import React, { useMemo } from "react";
import { PageHeader, Button, Input, Select } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { useCategories } from "./hook";
import type { CategorySummary, StatusFilter } from "./type";
import { useAuthStore } from "../../../../store/useAuthStore";
import { canWriteCatalog } from "../../../../lib/permissions";

const STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Đã vô hiệu hoá" },
  { value: "all", label: "Tất cả" },
];

const CategoriesPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const canWrite = canWriteCatalog(user);

  const {
    filtered,
    loading,
    error,
    q,
    setQ,
    status,
    setStatus,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    isSubmitting,
    handleToggleStatus,
    openAddModal,
    openEditModal,
    handleSaveCategory,
  } = useCategories();

  const columns = useMemo<Column<CategorySummary>[]>(
    () => [
      {
        key: "name",
        header: "Tên danh mục",
        render: (c) => (
          <span className="font-medium text-[#1c3a13]">{c.name}</span>
        ),
      },
      {
        key: "status",
        header: "Trạng thái",
        render: (c) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${
              c.isActive
                ? "bg-[#e3ecd9] text-[#1c3a13]"
                : "bg-[#eeeee9] text-[#666666]"
            }`}
          >
            {c.isActive ? "Hoạt động" : "Vô hiệu"}
          </span>
        ),
      },
      {
        key: "actions",
        header: <div className="text-right">Thao tác</div>,
        render: (c) => (
          <div className="flex items-center justify-end gap-2">
            {canWrite && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(c)}
                >
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(c)}
                >
                  {c.isActive ? "Vô hiệu hoá" : "Kích hoạt"}
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [openEditModal, handleToggleStatus, canWrite],
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Danh mục"
        title="Danh mục sản phẩm"
        description="Quản lý các danh mục phân loại mỹ phẩm trên hệ thống."
        actions={
          canWrite && (
            <Button variant="primary" onClick={openAddModal}>
              + Thêm danh mục
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8">
          <Input
            placeholder="Tìm kiếm danh mục theo tên…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="md:col-span-4">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-[16px] border border-[#eeeee9] overflow-hidden animate-pulse">
          <div className="h-[48px] bg-[#eeeee9]" />
          {[0, 1, 2, 3].map((i) => (
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
          rowKey={(c) => c.id}
          empty="Không tìm thấy danh mục phù hợp"
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#fcfcf7] border border-[#1c3a13] rounded-2xl w-[90%] max-w-[500px] shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#eeeee9] bg-[#fcfcf7]">
              <h3 className="text-[18px] text-[#1c3a13] font-medium">
                {editingId ? "Sửa danh mục" : "Thêm danh mục mới"}
              </h3>
            </div>
            <form
              onSubmit={handleSaveCategory}
              className="p-6 flex flex-col gap-6 bg-white"
            >
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Tên danh mục *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên danh mục..."
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#eeeee9]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu danh mục"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
