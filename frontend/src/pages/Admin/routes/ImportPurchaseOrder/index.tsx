import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Button, Card, Input, Select } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { purchaseOrdersService } from "../../../../services/purchase-orders.service";
import { suppliersService } from "../../../../services/suppliers.service";
import { productsService, type CosmeticDetail } from "../../../../services/products.service";
import { inventoryApi } from "../Inventory/api";
import { useBasePath } from "../../../../lib/useBasePath";
import { toast } from "sonner";

interface PendingOrder {
  id: string;
  code: string;
  supplierName: string;
  createdDate: string;
  totalAmount: number;
}

interface ImportLine {
  id: string;
  variantId: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("vi-VN");
}

const ImportPurchaseOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const basePath = useBasePath();

  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [variantLabels, setVariantLabels] = useState<Record<string, string>>({});
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [lines, setLines] = useState<ImportLine[]>([]);
  const [selectedInfo, setSelectedInfo] = useState<{
    code: string;
    supplierName: string;
    createdDate: string;
    totalAmount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLines, setLoadingLines] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [minStock, setMinStock] = useState<number>(0);
  const [viewingVariant, setViewingVariant] = useState("");

  useEffect(() => {
    Promise.all([
      purchaseOrdersService.getPurchaseOrders(undefined, "PENDING"),
      suppliersService.getSuppliers(),
      productsService.getCosmetics(),
    ])
      .then(async ([orders, suppliers, cosmetics]) => {
        const supplierName = new Map(suppliers.map((s) => [s.id, s.name]));
        setPendingOrders(
          orders.map((o) => ({
            id: o.id,
            code: o.code,
            supplierName: supplierName.get(o.supplierId) || o.supplierId,
            createdDate: formatDate(o.createdAt),
            totalAmount: o.totalAmount,
          })),
        );
        const details = await Promise.all(
          cosmetics.map((c) => productsService.getCosmeticById(c.id)),
        );
        const map: Record<string, string> = {};
        details.forEach((d: CosmeticDetail) => {
          d.variants.forEach((v) => {
            map[v.id] = `${d.name} – ${v.name}`;
          });
        });
        setVariantLabels(map);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Không thể tải danh sách phiếu nhập");
      })
      .finally(() => setLoading(false));
  }, []);

  const loadOrder = useCallback(
    (orderId: string) => {
      if (!orderId) {
        setLines([]);
        setSelectedInfo(null);
        setError("");
        return;
      }
      setLoadingLines(true);
      setError("");
      purchaseOrdersService
        .getPurchaseOrderById(orderId)
        .then((order) => {
          const info = pendingOrders.find((o) => o.id === orderId);
          setSelectedInfo({
            code: order.code,
            supplierName: info?.supplierName || order.supplierId,
            createdDate: formatDate(order.createdAt),
            totalAmount: order.totalAmount,
          });
          setLines(
            order.lines.map((l) => ({
              id: l.id,
              variantId: l.variantId,
              variantLabel: variantLabels[l.variantId] || l.variantId,
              quantity: l.quantity,
              unitPrice: l.unitPrice,
              subtotal: l.subtotal,
            })),
          );
        })
        .catch((err) => {
          console.error(err);
          setError("Không thể tải chi tiết phiếu nhập");
        })
        .finally(() => setLoadingLines(false));
    },
    [pendingOrders, variantLabels],
  );

  const handleSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
    loadOrder(orderId);
  };

  const totalQty = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  );

  const handleConfirm = async () => {
    if (!selectedOrderId) {
      toast.error("Vui lòng chọn phiếu nhập hàng");
      return;
    }
    setSaving(true);
    try {
      await purchaseOrdersService.completePurchaseOrder(selectedOrderId);

      if (minStock > 0) {
        for (const line of lines) {
          const item = await inventoryApi.findByVariant(line.variantId);
          if (item) {
            await inventoryApi.updateMinStock(item.id, minStock);
          }
        }
      }

      toast.success("Đã nhập kho thành công");
      navigate(`${basePath}/inventory`);
    } catch (error) {
      console.error(error);
      toast.error("Không thể nhập kho cho phiếu này");
    } finally {
      setSaving(false);
    }
  };

  const viewInventoryDetail = async (line: ImportLine) => {
    setViewingVariant(line.variantId);
    try {
      const item = await inventoryApi.findByVariant(line.variantId);
      if (item) {
        navigate(`${basePath}/inventory/${item.id}/edit`);
        return;
      }
      toast.error(`Chưa có hàng tồn kho cho "${line.variantLabel}"`);
    } catch (error) {
      console.error(error);
      toast.error("Không thể xem chi tiết tồn kho");
    } finally {
      setViewingVariant("");
    }
  };

  const columns: Column<ImportLine>[] = [
    {
      key: "variantLabel",
      header: "Sản phẩm",
      render: (l) => <span className="font-medium text-[#1c3a13]">{l.variantLabel}</span>,
    },
    {
      key: "variantId",
      header: "Mã biến thể",
      render: (l) => <span className="font-mono text-[12px] text-[#666666]">{l.variantId}</span>,
    },
    {
      key: "quantity",
      header: "SL",
      className: "text-center w-24",
      render: (l) => <span>{l.quantity}</span>,
    },
    {
      key: "unitPrice",
      header: "Đơn giá",
      className: "text-right w-40",
      render: (l) => (
        <span className="font-mono">{l.unitPrice.toLocaleString("vi-VN")}₫</span>
      ),
    },
    {
      key: "subtotal",
      header: "Thành tiền",
      className: "text-right w-48",
      render: (l) => (
        <span className="font-mono font-medium text-[#1c3a13]">
          {l.subtotal.toLocaleString("vi-VN")}₫
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-40",
      render: (l) => (
        <Button
          variant="outline"
          size="sm"
          disabled={viewingVariant === l.variantId}
          onClick={() => viewInventoryDetail(l)}
        >
          {viewingVariant === l.variantId ? "Đang tải..." : "Xem chi tiết tồn kho"}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto">
      <PageHeader
        eyebrow="Quản lý / Kho"
        title="Nhập kho từ phiếu nhập"
        description="Chọn phiếu nhập hàng đang chờ nhập kho. Hệ thống sẽ tự động bổ sung số lượng sản phẩm vào kho."
      />

      <Card className="flex flex-wrap items-center justify-between gap-6 !p-6">
        <div className="shrink-0" style={{ width: "420px", maxWidth: "100%" }}>
          <label className="block text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em] mb-2">
            Phiếu nhập hàng (Chờ nhập kho) *
          </label>
          <Select
            value={selectedOrderId}
            onChange={(e) => handleSelect(e.target.value)}
            disabled={loading}
            options={[
              { value: "", label: loading ? "Đang tải..." : "-- Chọn phiếu nhập hàng --" },
              ...pendingOrders.map((o) => ({
                value: o.id,
                label: `${o.code} – ${o.supplierName} (${o.createdDate})`,
              })),
            ]}
          />
        </div>
        <div className="text-[14px] text-[#666666] shrink-0">
          {pendingOrders.length === 0 ? (
            "Hiện không có phiếu nhập nào đang chờ nhập kho"
          ) : (
            <>
              Phiếu chờ nhập kho:{" "}
              <span className="font-medium text-[#1c3a13]">{pendingOrders.length}</span>
            </>
          )}
        </div>
      </Card>

      {selectedInfo && (
        <Card className="flex flex-wrap items-center justify-between gap-6 !p-6">
          <div className="text-[14px]">
            <span className="text-[#666666]">Mã phiếu: </span>
            <span className="font-mono font-medium text-[#1c3a13]">{selectedInfo.code}</span>
          </div>
          <div className="text-[14px] text-[#666666]">
            Nhà cung cấp: <span className="text-[#1c3a13]">{selectedInfo.supplierName}</span>
          </div>
          <div className="text-[14px] text-[#666666]">
            Ngày lập: <span className="text-[#1c3a13]">{selectedInfo.createdDate}</span>
          </div>
        </Card>
      )}

      <Card className="!p-0 overflow-hidden">
        {loadingLines ? (
          <div className="py-12 text-center text-[#666666]">Đang tải chi tiết phiếu...</div>
        ) : error ? (
          <div className="py-12 text-center text-[#b04747]">{error}</div>
        ) : lines.length === 0 ? (
          <div className="py-12 text-center text-[#666666]">
            Vui lòng chọn một phiếu nhập hàng để xem chi tiết.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <DataTable columns={columns} rows={lines} rowKey={(l) => l.id} />
            </div>
            <div className="p-6 border-t border-[#eeeee9] flex flex-wrap items-center justify-between gap-6">
              <div className="text-[14px] text-[#666666]">
                Tổng số dòng: <span className="font-medium text-[#1c3a13]">{lines.length}</span>
                <span className="mx-3">•</span>
                Tổng số lượng: <span className="font-medium text-[#1c3a13]">{totalQty}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[14px] font-medium text-[#666666]">Tổng tiền nhập:</span>
                <span className="font-mono text-[24px] font-medium text-[#1c3a13]">
                  {selectedInfo?.totalAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
            <div className="p-6 border-t border-[#eeeee9] flex flex-wrap items-end gap-6">
              <div className="shrink-0" style={{ width: "240px", maxWidth: "100%" }}>
                <label className="block text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em] mb-2">
                  Mức tồn tối thiểu
                </label>
                <Input
                  type="number"
                  min={0}
                  value={minStock || ""}
                  onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <p className="text-[12px] text-[#666666] pb-2.5">
                Áp dụng cho tất cả sản phẩm trong phiếu khi nhập kho. Khi tồn kho giảm xuống bằng
                mức này, sản phẩm sẽ hiển thị là "Sắp hết".
              </p>
            </div>
          </>
        )}
      </Card>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#eeeee9]">
        <Button variant="outline" onClick={() => navigate(`${basePath}/inventory`)}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!selectedOrderId || lines.length === 0 || saving}
        >
          {saving ? "Đang nhập kho..." : "Xác nhận nhập kho"}
        </Button>
      </div>
    </div>
  );
};

export default ImportPurchaseOrderPage;
