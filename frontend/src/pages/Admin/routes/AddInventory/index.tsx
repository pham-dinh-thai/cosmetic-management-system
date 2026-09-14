import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader, Card, Input, Button, Select } from "../../../../components/ui/Primitives";
import { toast } from "sonner";
import { productsService, type CosmeticSummary, type CosmeticDetailVariant } from "../../../../services/products.service";
import { suppliersService } from "../../../../services/suppliers.service";
import { inventoryApi } from "../Inventory/api";
import { useBasePath } from "../../../../lib/useBasePath";

const toDateInput = (value: string): string => value.slice(0, 10);

const AddInventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = useBasePath();
  const preselectedVariantId = (location.state as { variantId?: string } | null)?.variantId;

  const [products, setProducts] = useState<CosmeticSummary[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [variants, setVariants] = useState<CosmeticDetailVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(preselectedVariantId || "");
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [supplierId, setSupplierId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [expiredDate, setExpiredDate] = useState<string>("");
  const [minStock, setMinStock] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      productsService.getCosmetics(),
      suppliersService.getSuppliers(),
    ])
      .then(([productData, supplierData]) => {
        setProducts(productData);
        setSuppliers(supplierData.map((s) => ({ id: s.id, name: s.name })));
      })
      .catch(console.error);
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
    if (!supplierId) {
      toast.error("Vui lòng chọn nhà cung cấp");
      return;
    }
    if (!quantity || quantity <= 0) {
      toast.error("Số lượng nhập phải lớn hơn 0");
      return;
    }
    if (!expiredDate) {
      toast.error("Vui lòng chọn hạn sử dụng");
      return;
    }

    setSaving(true);
    try {
      let inventory = await inventoryApi.findByVariant(selectedVariantId);
      if (!inventory) {
        const created = await inventoryApi.createInventory(
          selectedVariantId,
          minStock,
        );
        inventory = {
          id: created.id,
          variantId: created.variantId,
          quantity: 0,
          minStock,
          isActive: true,
          batches: [],
        };
      } else if (inventory.minStock !== minStock) {
        await inventoryApi.updateMinStock(inventory.id, minStock);
      }

      await inventoryApi.addBatch(inventory.id, {
        supplierId,
        quantity,
        expiredDate: toDateInput(expiredDate),
      });

      toast.success("Nhập kho thành công");
      navigate(`${basePath}/inventory`);
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
        description="Bổ sung số lượng sản phẩm vào kho theo từng lô hàng."
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
              Phân loại *
            </label>
            <Select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              options={[
                { value: "", label: "-- Chọn phân loại --" },
                ...variants.map(v => ({ value: v.id, label: v.name }))
              ]}
              disabled={!selectedProductId || variants.length === 0}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
              Nhà cung cấp *
            </label>
            <Select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              options={[
                { value: "", label: "-- Chọn nhà cung cấp --" },
                ...suppliers.map(s => ({ value: s.id, label: s.name }))
              ]}
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
              Hạn sử dụng *
            </label>
            <Input
              type="date"
              value={expiredDate}
              onChange={(e) => setExpiredDate(e.target.value)}
              required
            />
            <p className="text-[11px] text-[#666666]">
              Ngày hết hạn của lô hàng này khi nhập kho.
            </p>
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
            <Button type="button" variant="outline" onClick={() => navigate(`${basePath}/inventory`)}>
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