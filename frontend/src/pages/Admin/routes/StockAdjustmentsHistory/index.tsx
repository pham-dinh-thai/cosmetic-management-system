import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Button, Card } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { inventoryApi, type StockAdjustmentDto } from "../Inventory/api";
import { useBasePath } from "../../../../lib/useBasePath";
import { toast } from "sonner";

const REASON_LABEL: Record<string, string> = {
  DAMAGED: "Hư hỏng",
  DEFECTIVE: "Lỗi",
  EXPIRED: "Hết hạn",
  OVERSTOCK: "Tồn dư",
  OTHER: "Khác",
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("vi-VN");
}

const StockAdjustmentsHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const basePath = useBasePath();

  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState<StockAdjustmentDto[]>([]);

  const loadHistory = useMemo(
    () => async () => {
      setHistoryLoading(true);
      try {
        const rows = await inventoryApi.getStockAdjustments();
        setHistory(rows);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải lịch sử điều chỉnh");
      } finally {
        setHistoryLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const historyColumns: Column<StockAdjustmentDto>[] = [
    {
      key: "variantId",
      header: "Mã biến thể",
      render: (h) => <span className="font-mono text-[12px] break-all">{h.variantId}</span>,
    },
    {
      key: "batchId",
      header: "Mã lô",
      render: (h) => <span className="font-mono text-[12px]">{h.batchId}</span>,
    },
    {
      key: "adjustment",
      header: "Điều chỉnh",
      className: "text-right",
      render: (h) => (
        <span
          className={`font-mono font-medium ${
            h.adjustment < 0 ? "text-[#b04747]" : "text-[#1c3a13]"
          }`}
        >
          {h.adjustment > 0 ? "+" : ""}
          {h.adjustment.toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      key: "reason",
      header: "Lý do",
      render: (h) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#eeeee9] text-[#666666]">
          {REASON_LABEL[h.reason] ?? h.reason}
        </span>
      ),
    },
    {
      key: "note",
      header: "Ghi chú",
      render: (h) => <span className="text-[#666666]">{h.note || "—"}</span>,
    },
    {
      key: "createdAt",
      header: "Thời gian",
      className: "text-right",
      render: (h) => <span>{formatDate(h.createdAt)}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto">
      <PageHeader
        eyebrow="Quản lý / Kho"
        title="Lịch sử điều chỉnh"
        description="Các lần điều chỉnh tồn kho (hư hỏng, lỗi, hết hạn, tồn dư, khác)."
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(`${basePath}/stock-adjustments`)}
          >
            ← Điều chỉnh tồn kho
          </Button>
        }
      />

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 pb-3 flex items-center justify-between">
          <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>
            Lịch sử điều chỉnh
          </h2>
          {historyLoading && <span className="text-[12px] text-[#666666]">Đang tải...</span>}
        </div>
        <DataTable
          columns={historyColumns}
          rows={history}
          rowKey={(h) => h.id}
          empty="Chưa có lần điều chỉnh nào"
        />
      </Card>
    </div>
  );
};

export default StockAdjustmentsHistoryPage;