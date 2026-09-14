import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Button, Card, Input, Select } from "../../../../components/ui/Primitives";
import { inventoryApi } from "../Inventory/api";
import { productsService } from "../../../../services/products.service";
import { suppliersService } from "../../../../services/suppliers.service";
import { useBasePath } from "../../../../lib/useBasePath";
import { toast } from "sonner";

const REASON_OPTIONS = [
  { value: "DAMAGED", label: "Hư hỏng" },
  { value: "DEFECTIVE", label: "Lỗi" },
  { value: "EXPIRED", label: "Hết hạn" },
  { value: "OVERSTOCK", label: "Tồn dư" },
  { value: "OTHER", label: "Khác" },
];

interface BatchOption {
  batchId: string;
  inventoryId: string;
  variantId: string;
  lotNumber: string;
  quantity: number;
  label: string;
}

const StockAdjustmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const basePath = useBasePath();

  const [loading, setLoading] = useState(true);
  const [batchOptions, setBatchOptions] = useState<BatchOption[]>([]);

  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [adjustment, setAdjustment] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [direction, setDirection] = useState<"increase" | "decrease">("decrease");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [inventory, products, suppliers] = await Promise.all([
          inventoryApi.fetchInventory(),
          productsService.getCosmetics(),
          suppliersService.getSuppliers(),
        ]);

        const meta = new Map<string, { productName: string; variantName: string }>();
        for (const c of products) {
          try {
            const detail = await productsService.getCosmeticById(c.id);
            detail.variants.forEach((v) => {
              meta.set(v.id, { productName: c.name, variantName: v.name });
            });
          } catch {
            // skip
          }
        }

        const supplierName = new Map(suppliers.map((s) => [s.id, s.name]));

        const options: BatchOption[] = [];
        for (const inv of inventory) {
          for (const b of inv.batches.filter((x) => x.isActive)) {
            const m = meta.get(inv.variantId);
            const supplier = supplierName.get(b.supplierId) || b.supplierId;
            options.push({
              batchId: b.id,
              inventoryId: inv.id,
              variantId: inv.variantId,
              lotNumber: b.lotNumber,
              quantity: b.quantity,
              label: `${m?.productName || inv.variantId} – ${
                m?.variantName || ""
              } | Lô ${b.lotNumber} | ${b.quantity} | ${supplier}`,
            });
          }
        }

        setBatchOptions(options);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách lô hàng");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBatchId) {
      toast.error("Vui lòng chọn lô hàng");
      return;
    }
    if (!adjustment || adjustment <= 0) {
      toast.error("Số lượng điều chỉnh phải lớn hơn 0");
      return;
    }
    if (!reason) {
      toast.error("Vui lòng chọn lý do");
      return;
    }

    const batch = batchOptions.find((b) => b.batchId === selectedBatchId);
    const signedAdjustment =
      direction === "decrease" ? -Math.abs(adjustment) : Math.abs(adjustment);

    if (direction === "decrease" && batch && signedAdjustment + batch.quantity < 0) {
      toast.error(
        `Không thể giảm ${adjustment} vì lô chỉ còn ${batch.quantity} đơn vị`,
      );
      return;
    }

    setSaving(true);
    try {
      await inventoryApi.createStockAdjustment({
        batchId: selectedBatchId,
        adjustment: signedAdjustment,
        reason,
        ...(note.trim() ? { note: note.trim() } : {}),
      });
      toast.success("Đã điều chỉnh tồn kho thành công");
      setSelectedBatchId("");
      setAdjustment(0);
      setNote("");
      setReason("");
    } catch (err) {
      console.error(err);
      const message = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      toast.error(message || "Không thể điều chỉnh tồn kho");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto">
      <PageHeader
        eyebrow="Quản lý / Kho"
        title="Xử lý tồn kho"
        description="Điều chỉnh số lượng lô hàng (hư hỏng, lỗi, hết hạn, tồn dư)."
        actions={
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(`${basePath}/inventory/stock-adjustments/history`)}
            >
              Lịch sử điều chỉnh
            </Button>
            <Button variant="outline" onClick={() => navigate(`${basePath}/inventory`)}>
              ← Về tồn kho
            </Button>
          </div>
        }
      />

      <Card className="!p-6">
        <h2 className="text-[20px] text-[#1c3a13] mb-4" style={{ fontWeight: 350 }}>
          Điều chỉnh tồn kho
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
              Lô hàng *
            </label>
            <Select
              value={selectedBatchId}
              onChange={(e) => {
                setSelectedBatchId(e.target.value);
                const b = batchOptions.find((x) => x.batchId === e.target.value);
                if (b && b.quantity === 0) {
                  setDirection("increase");
                }
              }}
              disabled={loading}
              options={[
                { value: "", label: loading ? "Đang tải..." : "-- Chọn lô hàng --" },
                ...batchOptions.map((b) => ({
                  value: b.batchId,
                  label: b.label,
                })),
              ]}
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-2 shrink-0" style={{ width: "200px" }}>
              <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                Loại điều chỉnh *
              </label>
              <Select
                value={direction}
                onChange={(e) => setDirection(e.target.value as "increase" | "decrease")}
                options={[
                  { value: "decrease", label: "Giảm tồn (-)" },
                  { value: "increase", label: "Tăng tồn (+)" },
                ]}
              />
            </div>
            <div className="flex flex-col gap-2 shrink-0" style={{ width: "200px" }}>
              <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                Số lượng *
              </label>
              <Input
                type="number"
                min={1}
                value={adjustment || ""}
                onChange={(e) => setAdjustment(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-2 shrink-0" style={{ width: "200px" }}>
              <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                Lý do *
              </label>
              <Select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                options={[
                  { value: "", label: "-- Chọn lý do --" },
                  ...REASON_OPTIONS,
                ]}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
              Ghi chú
            </label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú thêm (tuỳ chọn)..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-[#eeeee9]">
            <Button type="button" variant="outline" onClick={() => navigate(`${basePath}/inventory`)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={saving || loading}>
              {saving ? "Đang điều chỉnh..." : "Xác nhận điều chỉnh"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StockAdjustmentsPage;