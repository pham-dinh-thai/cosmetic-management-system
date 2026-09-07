import { useEffect, useState } from "react";
import { toast } from "sonner";
import { inventoryApi } from "./api";
import type { InventoryItem } from "./type";

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; item: InventoryItem | null }>({ isOpen: false, item: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    sku: "",
    productName: "",
    variantName: "",
    quantity: 0,
    minThreshold: 0,
    location: "",
    price: 0,
  });

  useEffect(() => {
    inventoryApi.fetchInventory().then((data) => {
      setInventory(data);
      setLoading(false);
    });
  }, []);

  const handleDeleteConfirm = () => {
    if (!confirmDelete.item) return;
    setInventory(prev => prev.filter(i => i.id !== confirmDelete.item!.id));
    toast.success(`Đã xoá tồn kho của ${confirmDelete.item.productName}`);
    setConfirmDelete({ isOpen: false, item: null });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ sku: "", productName: "", variantName: "", quantity: 0, minThreshold: 0, location: "", price: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingId(item.id);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setInventory(prev => prev.map(i => i.id === editingId ? { ...i, ...formData } as InventoryItem : i));
      toast.success("Cập nhật tồn kho thành công");
    } else {
      const newItem = { ...formData, id: Math.random().toString(36).substr(2, 9) } as InventoryItem;
      setInventory(prev => [newItem, ...prev]);
      toast.success("Thêm tồn kho thành công");
    }
    setIsModalOpen(false);
  };

  const filtered = inventory.filter(
    (i) =>
      !q ||
      i.productName.toLowerCase().includes(q.toLowerCase()) ||
      i.sku.toLowerCase().includes(q.toLowerCase()) ||
      i.variantName.toLowerCase().includes(q.toLowerCase()),
  );

  return { inventory: filtered, loading, q, setQ, confirmDelete, setConfirmDelete, isModalOpen, setIsModalOpen, editingId, formData, setFormData, handleDeleteConfirm, openAddModal, openEditModal, handleSave };
}
