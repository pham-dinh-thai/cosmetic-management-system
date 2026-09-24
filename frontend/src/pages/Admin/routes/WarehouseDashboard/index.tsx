import React, { useEffect, useState } from "react";
import { PageHeader, Card, Kpi } from "../../../../components/ui/Primitives";
import { inventoryApi, type ExpiringBatchDto } from "../Inventory/api";
import type { InventoryItem } from "../Inventory/type";
import { purchaseOrdersService, type PurchaseOrderDto } from "../../../../services/purchase-orders.service";
import { suppliersService, type SupplierSummary } from "../../../../services/suppliers.service";
import { overviewService, formatVnd, type CosmeticDetail } from "../../../../services/overview.service";

const PURCHASE_STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ nhập",
  COMPLETED: "Đã nhập",
  CANCELLED: "Đã hủy",
};

interface LowStockRow {
  variantId: string;
  name: string;
  code: string;
  quantity: number;
  minStock: number;
}

interface WarehouseData {
  skuCount: number;
  totalUnits: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  lowStock: LowStockRow[];
  expiring: {
    lotNumber: string;
    name: string;
    quantity: number;
    expiredDate: string;
  }[];
  recentPurchases: {
    code: string;
    supplierName: string;
    status: string;
    totalAmount: number;
    createdAt: string;
  }[];
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function buildWarehouseData(
  items: InventoryItem[],
  expiring: ExpiringBatchDto[],
  purchases: PurchaseOrderDto[],
  cosmetics: CosmeticDetail[],
  suppliers: SupplierSummary[],
): WarehouseData {
  const variantMap = new Map<
    string,
    { name: string; code: string; price: number; costPrice: number | null }
  >();
  for (const c of cosmetics) {
    for (const v of c.variants) {
      variantMap.set(v.id, {
        name: v.name,
        code: c.code,
        price: Number(v.price ?? 0),
        costPrice: v.costPrice != null ? Number(v.costPrice) : null,
      });
    }
  }
  const supplierMap = new Map(suppliers.map((s) => [s.id, s.name]));

  const valueOf = (variantId: string, quantity: number): number => {
    const v = variantMap.get(variantId);
    const unit = v?.costPrice ?? v?.price ?? 0;
    return quantity * unit;
  };

  const active = items.filter((i) => i.isActive !== false);
  const totalUnits = active.reduce((sum, i) => sum + i.quantity, 0);
  const totalValue = active.reduce(
    (sum, i) => sum + valueOf(i.variantId, i.quantity),
    0,
  );

  const lowStock = active
    .filter(
      (i) =>
        i.quantity > 0 &&
        i.quantity <= (i.minStock > 0 ? i.minStock : 20),
    )
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 6)
    .map((i) => {
      const v = variantMap.get(i.variantId);
      return {
        variantId: i.variantId,
        name: v?.name || "Sản phẩm không xác định",
        code: v?.code || "N/A",
        quantity: i.quantity,
        minStock: i.minStock || 20,
      };
    });

  const outOfStockCount = active.filter((i) => i.quantity === 0).length;

  const expiringRows = [...expiring]
    .sort(
      (a, b) =>
        new Date(a.expiredDate).getTime() - new Date(b.expiredDate).getTime(),
    )
    .slice(0, 5)
    .map((b) => {
      const v = variantMap.get(b.variantId);
      return {
        lotNumber: b.lotNumber,
        name: v?.name || "Sản phẩm không xác định",
        quantity: b.quantity,
        expiredDate: b.expiredDate,
      };
    });

  const recentPurchases = [...purchases]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
    .map((p) => ({
      code: p.code,
      supplierName: supplierMap.get(p.supplierId) || "—",
      status: PURCHASE_STATUS_LABEL[p.status] ?? p.status,
      totalAmount: Number(p.totalAmount ?? 0),
      createdAt: p.createdAt,
    }));

  return {
    skuCount: active.length,
    totalUnits,
    totalValue,
    lowStockCount: lowStock.length,
    outOfStockCount,
    lowStock,
    expiring: expiringRows,
    recentPurchases,
  };
}

const WarehouseDashboard: React.FC = () => {
  const [data, setData] = useState<WarehouseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [items, expiring, purchases, cosmetics, suppliers] =
          await Promise.all([
            inventoryApi.fetchInventory().catch(() => [] as InventoryItem[]),
            inventoryApi.getExpiringBatches(30).catch(() => [] as ExpiringBatchDto[]),
            purchaseOrdersService.getPurchaseOrders().catch(() => [] as PurchaseOrderDto[]),
            overviewService.getCosmeticDetails().catch(() => [] as CosmeticDetail[]),
            suppliersService.getSuppliers().catch(() => [] as SupplierSummary[]),
          ]);
        if (!active) return;
        setData(buildWarehouseData(items, expiring, purchases, cosmetics, suppliers));
      } catch (err) {
        if (!active) return;
        setError("Không thể tải dữ liệu kho. Vui lòng thử lại.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const header = (
    <PageHeader
      eyebrow="Kho / Tổng quan"
      title="Tổng quan kho"
      description="Theo dõi tồn kho, hàng sắp hết, lô sắp hết hạn và các phiếu nhập gần nhất."
    />
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        {header}
        <div className="py-12 text-center text-[#666666]">Đang tải dữ liệu…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-10">
        {header}
        <div className="bg-[#eeeee9] text-[#1c3a13] p-4 rounded-[16px] text-[14px]">
          {error || "Không có dữ liệu để hiển thị."}
        </div>
      </div>
    );
  }

  const valueCaption =
    data.skuCount + data.lowStockCount + data.outOfStockCount === 0
      ? "Chưa có dữ liệu"
      : `${data.lowStockCount} hàng sắp hết · ${data.outOfStockCount} hết hàng`;

  return (
    <div className="flex flex-col gap-10">
      {header}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Kpi
          label="Mặt hàng đang theo dõi"
          value={data.skuCount.toLocaleString("vi-VN")}
          caption="SKU trong kho"
          accent="forest"
        />
        <Kpi
          label="Tổng tồn kho"
          value={data.totalUnits.toLocaleString("vi-VN")}
          caption="đơn vị sản phẩm"
          accent="lime"
        />
        <Kpi
          label="Giá trị tồn kho"
          value={formatVnd(Math.round(data.totalValue))}
          caption="theo giá vốn/giá bán"
          accent="sage"
        />
        <Kpi
          label="Cảnh báo tồn kho"
          value={String(data.lowStockCount + data.outOfStockCount)}
          caption={valueCaption}
          accent="olive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
            Hàng sắp hết
          </p>
          <h3
            className="mt-2 text-[#1c3a13]"
            style={{ fontWeight: 350, fontSize: "24px", lineHeight: 1.1, letterSpacing: "-0.48px" }}
          >
            Cần nhập thêm
          </h3>

          {data.lowStock.length === 0 ? (
            <p className="py-4 text-[14px] text-[#666666]">Không có mặt hàng nào sắp hết.</p>
          ) : (
            <ol className="flex flex-col">
              {data.lowStock.map((row) => (
                <li
                  key={row.variantId}
                  className="flex items-center gap-5 py-4 border-t border-[#eeeee9] first:border-t-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1c3a13] truncate" style={{ fontWeight: 350, fontSize: "16px" }}>
                      {row.name}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#666666] mt-0.5">
                      {row.code} · định mức {row.minStock}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[14px] text-[#8f3f2a] font-medium">{row.quantity} còn lại</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
            Lô sắp hết hạn
          </p>
          <h3
            className="mt-2 text-[#1c3a13]"
            style={{ fontWeight: 350, fontSize: "24px", lineHeight: 1.1, letterSpacing: "-0.48px" }}
          >
            Trong 30 ngày tới
          </h3>

          {data.expiring.length === 0 ? (
            <p className="py-4 text-[14px] text-[#666666]">Không có lô hàng nào sắp hết hạn.</p>
          ) : (
            <ol className="flex flex-col">
              {data.expiring.map((row, i) => (
                <li
                  key={`${row.lotNumber}-${i}`}
                  className="flex items-center gap-5 py-4 border-t border-[#eeeee9] first:border-t-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1c3a13] truncate" style={{ fontWeight: 350, fontSize: "16px" }}>
                      {row.name}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#666666] mt-0.5">
                      Lô {row.lotNumber}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[14px] text-[#1c3a13]">{row.quantity} đơn vị</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#8f3f2a] mt-0.5">
                      {fmtDate(row.expiredDate)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
              Phiếu nhập
            </p>
            <h3
              className="mt-2 text-[#1c3a13]"
              style={{ fontWeight: 350, fontSize: "24px", lineHeight: 1.1, letterSpacing: "-0.48px" }}
            >
              Nhập hàng gần đây
            </h3>
          </div>
        </div>

        {data.recentPurchases.length === 0 ? (
          <p className="py-4 text-[14px] text-[#666666]">Chưa có phiếu nhập nào.</p>
        ) : (
          <div className="flex flex-col">
            {data.recentPurchases.map((p) => (
              <div
                key={p.code}
                className="flex items-center gap-5 py-4 border-t border-[#eeeee9] first:border-t-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[#1c3a13] truncate" style={{ fontWeight: 350, fontSize: "16px" }}>
                    {p.code}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#666666] mt-0.5">
                    {p.supplierName} · {fmtDate(p.createdAt)}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] px-2.5 py-1 rounded-full bg-[#eeeee9] text-[#1c3a13]">
                  {p.status}
                </span>
                <p className="text-right shrink-0 text-[14px] text-[#1c3a13]">
                  {formatVnd(p.totalAmount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default WarehouseDashboard;