import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button, Card, Select } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { purchaseOrdersService, openPurchaseReceiptPrint } from "../../../../services/purchase-orders.service";
import { suppliersService } from "../../../../services/suppliers.service";
import { productsService, type CosmeticDetail } from "../../../../services/products.service";
import { toast } from "sonner";

interface EditableLine {
  localId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
}

interface VariantOption {
  id: string;
  label: string;
  price: number;
}

const newLine = (): EditableLine => ({
  localId: Math.random().toString(36).substring(2, 9),
  variantId: "",
  quantity: 1,
  unitPrice: 0,
});

const AddPurchaseOrderPage: React.FC = () => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [supplierId, setSupplierId] = useState("");
  const [lines, setLines] = useState<EditableLine[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      suppliersService.getSuppliers(),
      productsService.getCosmetics(),
    ])
      .then(async ([supplierData, cosmetics]) => {
        setSuppliers(supplierData.map((s) => ({ id: s.id, name: s.name })));
        const details = await Promise.all(
          cosmetics.map((c) => productsService.getCosmeticById(c.id)),
        );
        const options: VariantOption[] = details.flatMap((d: CosmeticDetail) =>
          d.variants
            .filter((v) => v.isActive)
            .map((v) => ({
              id: v.id,
              label: `${d.name} – ${v.name}`,
              price: v.costPrice ?? v.price,
            })),
        );
        setVariantOptions(options);
        setLines([newLine()]);
      })
      .catch((err) => console.error(err));
  }, []);

  const totalAmount = lines.reduce(
    (sum, l) => sum + l.quantity * l.unitPrice,
    0,
  );

  const handleLineVariant = (lineId: string, variantId: string) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.localId !== lineId) return l;
        const variant = variantOptions.find((v) => v.id === variantId);
        return {
          ...l,
          variantId,
          unitPrice: variant ? variant.price : l.unitPrice,
        };
      }),
    );
  };

  const handleLineChange = (
    lineId: string,
    field: "quantity" | "unitPrice",
    value: number,
  ) => {
    setLines((prev) =>
      prev.map((l) => (l.localId === lineId ? { ...l, [field]: value } : l)),
    );
  };

  const createOrder = async (): Promise<{ id: string } | null> => {
    if (!supplierId) {
      toast.error("Vui lòng chọn nhà cung cấp");
      return null;
    }
    const validLines = lines.filter((l) => l.variantId);
    if (validLines.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm");
      return null;
    }
    setSaving(true);
    try {
      return await purchaseOrdersService.createPurchaseOrder({
        supplierId,
        lines: validLines.map((l) => ({
          variantId: l.variantId,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      });
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi tạo phiếu nhập");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    const created = await createOrder();
    if (!created) return;
    toast.success("Đã tạo phiếu nhập thành công");
    navigate("/admin/purchase");
  };

  const handlePrint = async () => {
    const created = await createOrder();
    if (!created) return;
    await openPurchaseReceiptPrint(created.id);
    setSupplierId("");
    setLines([newLine()]);
  };

  const columns: Column<EditableLine>[] = [
    {
      key: "variantId",
      header: "Sản phẩm",
      render: (l) => (
        <Select
          value={l.variantId}
          onChange={(e) => handleLineVariant(l.localId, e.target.value)}
          options={[
            { value: "", label: "Chọn sản phẩm *" },
            ...variantOptions.map((v) => ({ value: v.id, label: v.label })),
          ]}
          className="w-full"
        />
      ),
    },
    {
      key: "quantity",
      header: "SL",
      className: "text-center w-32",
      render: (l) => (
        <Input
          type="number"
          min={1}
          value={l.quantity}
          onChange={(e) => handleLineChange(l.localId, "quantity", parseInt(e.target.value) || 0)}
          className="text-center !px-2 !py-1.5"
          style={{ minWidth: "80px" }}
        />
      ),
    },
    {
      key: "unitPrice",
      header: "Đơn giá",
      className: "text-right w-48",
      render: (l) => (
        <Input
          type="number"
          min={0}
          value={l.unitPrice}
          onChange={(e) => handleLineChange(l.localId, "unitPrice", parseInt(e.target.value) || 0)}
          className="text-right !px-2 !py-1.5"
          style={{ minWidth: "120px" }}
        />
      ),
    },
    {
      key: "total",
      header: "Thành tiền",
      className: "text-right w-48",
      render: (l) => (
        <span className="font-mono font-medium text-[#1c3a13]">
          {(l.quantity * l.unitPrice).toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-20",
      render: (l) => (
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          onClick={() => setLines((prev) => prev.filter((x) => x.localId !== l.localId))}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto">
      <PageHeader
        eyebrow="Quản lý / Nhập hàng"
        title="Tạo phiếu nhập hàng"
        description="Chọn nhà cung cấp và các sản phẩm cần nhập."
      />

      <Card className="flex flex-wrap items-center justify-between gap-6 !p-6">
        <div className="shrink-0" style={{ width: "320px", maxWidth: "100%" }}>
          <Select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            options={[
              { value: "", label: "Nhà cung cấp *" },
              ...suppliers.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
        </div>
        <div className="text-[14px] font-medium text-[#666666] shrink-0">
          Mã phiếu: <span className="text-[#1c3a13] ml-1">Tự động khi lưu</span>
        </div>
        <div className="text-[14px] text-[#666666] shrink-0">
          Ngày: <span className="text-[#1c3a13] ml-1">{new Date().toLocaleDateString("vi-VN")}</span>
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            rows={lines}
            rowKey={(l) => l.localId}
            empty="Chưa có sản phẩm nào"
          />
        </div>

        <div className="p-6 border-t border-[#eeeee9] flex flex-wrap items-center justify-between gap-6">
          <Button
            variant="outline"
            onClick={() => setLines((prev) => [...prev, newLine()])}
            className="shrink-0"
          >
            + Thêm sản phẩm
          </Button>
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-[14px] font-medium text-[#666666]">Tổng tiền nhập:</span>
            <span className="font-mono text-[24px] font-medium text-[#1c3a13]">
              {totalAmount.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#eeeee9]">
        <Button variant="outline" onClick={() => navigate("/admin/purchase")}>
          Huỷ
        </Button>
        <Button variant="outline" onClick={handlePrint} disabled={saving || !supplierId}>
          In
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || !supplierId}>
          {saving ? "Đang tạo..." : "Hoàn tất"}
        </Button>
      </div>
    </div>
  );
};

export default AddPurchaseOrderPage;