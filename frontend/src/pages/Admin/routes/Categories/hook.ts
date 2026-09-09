import { useCallback, useEffect, useMemo, useState } from "react";
import { categoriesApi } from "./api";
import type { CategorySummary, StatusFilter } from "./type";
import { toast } from "sonner";

export function useCategories() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = useCallback(() => {
    categoriesApi
      .getCategories()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message || "Không thể tải dữ liệu danh mục.",
        );
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filtered = useMemo(() => {
    return categories.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (status === "active" && !c.isActive) return false;
      if (status === "inactive" && c.isActive) return false;
      return true;
    });
  }, [categories, q, status]);

  const handleToggleStatus = async (cat: CategorySummary) => {
    try {
      if (cat.isActive) {
        await categoriesApi.deactivateCategory(cat.id);
        toast.success(`Đã vô hiệu hoá danh mục "${cat.name}"`);
      } else {
        await categoriesApi.activateCategory(cat.id);
        toast.success(`Đã kích hoạt lại danh mục "${cat.name}"`);
      }
      loadCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi đổi trạng thái.");
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategorySummary) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name });
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Tên danh mục không được để trống.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await categoriesApi.updateCategory(editingId, {
          name: formData.name,
        });
        toast.success("Đã cập nhật danh mục thành công!");
      } else {
        await categoriesApi.createCategory({
          name: formData.name,
        });
        toast.success("Đã thêm danh mục mới!");
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi lưu danh mục.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    categories,
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
  };
}
