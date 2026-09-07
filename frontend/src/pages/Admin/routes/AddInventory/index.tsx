import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader, Card, Input, Button, Select } from "../../../../components/ui/Primitives";
import { toast } from "sonner";
import { productsService, type CosmeticSummary, type CosmeticDetailVariant } from "../../../../services/products.service";
import { inventoryApi } from "../Inventory/api";

const AddInventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedVariantId = (location.state as { variantId?: string } | null)?.variantId;

  const [products, setProducts] = useState<CosmeticSummary[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [variants, setVariants] = useState<CosmeticDetailVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(preselectedVariantId || "");
  const [quantity, setQuantity] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    productsService.getCosmetics().then(setProducts).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      productsService.getCosmeticById(selectedProductId)
        .then(detail => setVariants(detail.variants))
        .catch(console.error);
    } else {
      setVariants([]);
    }
  }, [selectedProductId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) {
      toast.error("Vui lòng chọn biến thể sản phẩm");
      return;
    }
    if (!quantity || quantity <= 0) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }

    setSaving(true);
    try {
      const existing = await inventoryApi.findByVariant(selectedVariantId);
      await inventoryApi.adjustInventoryWithReason(
        selectedVariantId,
        quantity,
        "OTHER",
        "Nhập kho",
        minStock,
      );
      if (existing) {
        await inventoryApi.updateMinStock(existing.id, minStock);
      }
      toast.success("Nhập kho thành công");
      navigate("/admin/inventory");
    } catch (error) {
      console.error(error);
      const message = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      toast.error(message || "Lỗi khi nhập kho");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Quản lý / Tồn kho"
        title="Nhập kho"
        description="Bổ sung số lượng sản phẩm vào kho."
      />

      <Card className="max-w-2xl">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
              Sản phẩm *
            </label>
            <Select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              options={[
                { value: "", label: "-- Chọn sản phẩm --" },
                ...products.map(p => ({ value: p.id, label: p.name }))
              ]}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
              Biến thể *
            </label>
            <Select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              options={[
                { value: "", label: "-- Chọn biến thể --" },
                ...variants.map(v => ({ value: v.id, label: v.name }))
              ]}
              disabled={!selectedProductId || variants.length === 0}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
              Số lượng nhập *
            </label>
            <Input
              type="number"
              min={1}
              value={quantity || ""}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
              Mức tồn tối thiểu
            </label>
            <Input
              type="number"
              min={0}
              value={minStock || ""}
              onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
            />
            <p className="text-[11px] text-[#666666]">
              Khi tồn kho giảm xuống bằng mức này, sản phẩm sẽ hiển thị là
              "Sắp hết" để bạn kịp nhập thêm.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-[#eeeee9]">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/inventory")}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Đang lưu..." : "Nhập kho"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddInventoryPage;