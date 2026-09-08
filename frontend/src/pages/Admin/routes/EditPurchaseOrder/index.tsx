import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, Input, Button, Card, Select } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { purchaseOrdersService, openPurchaseReceiptPrint } from "../../../../services/purchase-orders.service";
import { suppliersService } from "../../../../services/suppliers.service";
import { useBasePath } from "../../../../lib/useBasePath";
import { toast } from "sonner";

interface EditableLine {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
}

const statusMeta: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Chờ nhập kho", className: "bg-[#f3f0d9] text-[#9f995b]" },
  COMPLETED: { label: "Đã nhập kho", className: "bg-[#e3ecd9] text-[#1c3a13]" },
  CANCELLED: { label: "Đã hủy", className: "bg-[#f0ded9] text-[#8f3f2a]" },
};

const EditPurchaseOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const basePath = useBasePath();

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [supplierId, setSupplierId] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [lines, setLines] = useState<EditableLine[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      suppliersService.getSuppliers(),
      purchaseOrdersService.getPurchaseOrderById(id),
    ])
      .then(([supplierData, order]) => {
        setSuppliers(supplierData.map((s) => ({ id: s.id, name: s.name })));
        setSupplierId(order.supplierId);
        setCode(order.code);
        setStatus(order.status);
        setCreatedDate(order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("vi-VN")
          : "-");
        setLines(
          order.lines.map((l) => ({
            id: l.id,
            variantId: l.variantId,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
          })),
        );
      })
      .catch((err) => {
        console.error(err);
        toast.error("Không thể tải thông tin phiếu nhập");
        navigate(`${basePath}/purchase`);
      })
      .finally(() => setFetching(false));
  }, [id, navigate]);

  const totalAmount = lines.reduce(
    (sum, l) => sum + l.quantity * l.unitPrice,
    0,
  );

  const handleLineChange = (
    lineId: string,
    field: "quantity" | "unitPrice",
    value: number,
  ) => {
    setLines((prev) =>
      prev.map((l) => (l.id === lineId ? { ...l, [field]: value } : l)),
    );
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await purchaseOrdersService.updatePurchaseOrder(id, {
        supplierId,
        lines: lines.map((l) => ({
          variantId: l.variantId,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      });
      toast.success("Đã cập nhật phiếu nhập thành công");
      navigate(`${basePath}/purchase`);
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi lưu phiếu nhập");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await purchaseOrdersService.cancelPurchaseOrder(id);
      toast.success("Đã hủy phiếu nhập");
      navigate(`${basePath}/purchase`);
    } catch (error) {
      console.error(error);
      toast.error("Không thể hủy phiếu này");
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await purchaseOrdersService.completePurchaseOrder(id);
      toast.success("Đã nhập kho thành công");
      navigate(`${basePath}/purchase`);
    } catch (error) {
      console.error(error);
      toast.error("Không thể xác nhận nhập kho cho phiếu này");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<EditableLine>[] = [
    {
      key: "variantId",
      header: "Sản phẩm (variant)",
      render: (l) => <span className="font-mono text-[12px] text-[#666666]">{l.variantId}</span>,
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
          onChange={(e) => handleLineChange(l.id, "quantity", parseInt(e.target.value) || 0)}
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
          onChange={(e) => handleLineChange(l.id, "unitPrice", parseInt(e.target.value) || 0)}
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
  ];

  if (fetching) {
    return <div className="py-12 text-center text-[#666666]">Đang tải phiếu nhập…</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto">
      <PageHeader
        eyebrow="Quản lý / Nhập hàng"
        title="Cập nhật phiếu nhập hàng"
        description="Chỉnh sửa nhà cung cấp và các dòng sản phẩm nhập."
      />

      <Card className="flex flex-wrap items-center justify-between gap-6 !p-6">
        <div className="shrink-0" style={{ width: "256px", maxWidth: "100%" }}>
          <Select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            options={[
              ...(supplierId ? [] : [{ value: "", label: "Nhà cung cấp *" }]),
              ...suppliers.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
        </div>
        <div className="text-[14px] font-medium text-[#666666] shrink-0">
          Mã phiếu: <span className="text-[#1c3a13] ml-1">{code}</span>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <span className="text-[14px] text-[#666666]">Ngày: <span className="text-[#1c3a13] ml-1">{createdDate}</span></span>
          {status && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${statusMeta[status]?.className ?? "bg-[#eeeee9] text-[#666666]"}`}>
              {statusMeta[status]?.label ?? status}
            </span>
          )}
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            rows={lines}
            rowKey={(l) => l.id}
            empty="Chưa có dòng sản phẩm nào"
          />
        </div>

        <div className="p-6 border-t border-[#eeeee9] flex items-center justify-end">
          <div className="flex items-center gap-4">
            <span className="text-[14px] font-medium text-[#666666]">Tổng tiền nhập:</span>
            <span className="font-mono text-[24px] font-medium text-[#1c3a13]">
              {totalAmount.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </Card>

      <div className="flex justify-between gap-3 pt-4 border-t border-[#eeeee9]">
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleComplete} disabled={saving || status !== "PENDING" || !id}>
            Xác nhận nhập kho
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={saving || status !== "PENDING" || !id}>
            Hủy phiếu
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`${basePath}/purchase`)}>
            Huỷ
          </Button>
          <Button variant="outline" onClick={() => id && openPurchaseReceiptPrint(id)} disabled={!id}>
            In
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving || !id || !supplierId || status !== "PENDING"}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPurchaseOrderPage;