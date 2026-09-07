import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, Card, Input, Button } from "../../../../components/ui/Primitives";
import { toast } from "sonner";
import { productsService } from "../../../../services/products.service";
import { inventoryApi } from "../Inventory/api";

const EditInventoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productLabel, setProductLabel] = useState("");
  const [variantLabel, setVariantLabel] = useState("");
  const [variantIdLabel, setVariantIdLabel] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [originalQuantity, setOriginalQuantity] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const row = await inventoryApi.getById(id);

        setQuantity(row.quantity);
        setOriginalQuantity(row.quantity);
        setMinStock(row.minStock);
        setVariantIdLabel(row.variantId);

        try {
          const cosmetics = await productsService.getCosmetics();
          for (const c of cosmetics) {
            const detail = await productsService.getCosmeticById(c.id);
            const variant = detail.variants.find(
              (v) => v.id === row.variantId,
            );
            if (variant) {
              setProductLabel(c.name);
              setVariantLabel(variant.name);
              break;
            }
          }
        } catch {
          setVariantLabel("");
        }
      } catch (e) {
        console.error(e);
        setError("Không thể tải dữ liệu dòng tồn kho");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (quantity < 0) {
      toast.error("Số lượng tồn không thể âm");
      return;
    }
    if (minStock < 0) {
      toast.error("Mức tồn tối thiểu không thể âm");
      return;
    }

    setSaving(true);
    try {
      if (quantity !== originalQuantity) {
        await inventoryApi.adjustInventory(id, quantity - originalQuantity);
      }
      await inventoryApi.updateMinStock(id, minStock);
      toast.success("Cập nhật tồn kho thành công");
      navigate("/admin/inventory");
    } catch (error) {
      console.error(error);
      const message = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      toast.error(message || "Lỗi khi cập nhật tồn kho");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Quản lý / Tồn kho"
        title="Sửa tồn kho"
        description="Cập nhật số lượng tồn và mức tồn tối thiểu."
      />

      <Card className="max-w-2xl">
        {loading ? (
          <div className="py-12 text-center text-[#666666]">Đang tải…</div>
        ) : error ? (
          <div className="py-12 text-center text-[#b04747]">{error}</div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                Sản phẩm
              </label>
              <div className="text-[14px] text-[#1c3a13] font-medium">
                {productLabel || "-"}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                Phân loại
              </label>
              <div className="text-[14px] text-[#666666]">
                {variantLabel || variantIdLabel || "-"}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                Số lượng tồn *
              </label>
              <Input
                type="number"
                min={0}
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
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default EditInventoryPage;