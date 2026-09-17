import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PageHeader,
  Button,
  Card,
  Input,
  Select,
} from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import {
  accountingService,
  RECEIPT_SOURCE_LABEL,
  type ReceiptSource,
  type ReceiptSummary,
} from "../../../../services/accounting.service";
import { toast } from "sonner";

const SOURCE_FILTER_OPTIONS = [
  { value: "", label: "Tất cả nguồn" },
  { value: "MANUAL", label: "Thủ công" },
  { value: "AUTO_INVOICE_PAYMENT", label: "Tự động (thu nợ)" },
];

function formatCurrency(value: number): string {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("vi-VN");
}

const ReceiptsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [receipts, setReceipts] = useState<ReceiptSummary[]>([]);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"" | ReceiptSource>("");

  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [saving, setSaving] = useState(false);

  const loadReceipts = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await accountingService.getReceipts({
        ...(search ? { search } : {}),
        ...(sourceFilter ? { source: sourceFilter } : {}),
      });
      setReceipts(rows);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách phiếu thu");
    } finally {
      setLoading(false);
    }
  }, [search, sourceFilter]);

  useEffect(() => {
    void loadReceipts();
  }, [loadReceipts]);

  const total = useMemo(
    () => receipts.reduce((sum, r) => sum + Number(r.amount), 0),
    [receipts],
  );

  const resetForm = () => {
    setAmount("");
    setNote("");
    setCustomerId("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Số tiền phải là số dương");
      return;
    }

    setSaving(true);
    try {
      const created = await accountingService.createReceipt({
        amount: parsedAmount,
        note: note.trim() || undefined,
        customerId: customerId.trim() || undefined,
      });
      toast.success(`Đã tạo phiếu thu ${created.code}`);
      resetForm();
      setShowForm(false);
      await loadReceipts();
    } catch (err) {
      console.error(err);
      toast.error("Không thể tạo phiếu thu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (receipt: ReceiptSummary) => {
    if (!window.confirm(`Xóa phiếu thu ${receipt.code}?`)) return;

    try {
      await accountingService.deleteReceipt(receipt.id);
      toast.success("Đã xóa phiếu thu");
      await loadReceipts();
    } catch (err) {
      console.error(err);
      toast.error("Không thể xóa phiếu thu");
    }
  };

  const columns: Column<ReceiptSummary>[] = [
    {
      key: "code",
      header: "Mã phiếu",
      render: (r) => <span className="font-mono text-[12px]">{r.code}</span>,
    },
    {
      key: "amount",
      header: "Số tiền",
      className: "text-right",
      render: (r) => (
        <span className="font-mono font-medium text-[#1c3a13]">
          {formatCurrency(Number(r.amount))}
        </span>
      ),
    },
    {
      key: "source",
      header: "Nguồn",
      render: (r) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
            r.source === "AUTO_INVOICE_PAYMENT"
              ? "bg-[#e3efe0] text-[#1c3a13]"
              : "bg-[#eeeee9] text-[#666666]"
          }`}
        >
          {RECEIPT_SOURCE_LABEL[r.source]}
        </span>
      ),
    },
    {
      key: "note",
      header: "Ghi chú",
      render: (r) => <span className="text-[#666666]">{r.note || "—"}</span>,
    },
    {
      key: "createdAt",
      header: "Thời gian",
      className: "text-right",
      render: (r) => <span>{formatDate(r.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (r) => (
        <Button variant="ghost" size="sm" onClick={() => handleDelete(r)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1100px] mx-auto">
      <PageHeader
        eyebrow="Quản lý / Thu chi"
        title="Phiếu thu"
        description="Ghi nhận tiền thu vào. Phiếu thu tự động được tạo khi khách thanh toán hóa đơn, hoặc có thể nhập thủ công."
        actions={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Đóng" : "+ Phiếu thu"}
          </Button>
        }
      />

      {showForm && (
        <Card>
          <h2 className="text-[20px] text-[#1c3a13] mb-4" style={{ fontWeight: 350 }}>
            Tạo phiếu thu thủ công
          </h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] text-[#666666]">Số tiền *</span>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="VD: 150000"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] text-[#666666]">Mã khách hàng (tuỳ chọn)</span>
                <Input
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="UUID khách hàng"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] text-[#666666]">Ghi chú</span>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Lý do thu"
              />
            </label>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Huỷ
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu phiếu thu"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>
              Danh sách phiếu thu
            </h2>
            <p className="text-[13px] text-[#666666] mt-1">
              Tổng thu:{" "}
              <span className="font-mono font-medium text-[#1c3a13]">
                {formatCurrency(total)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã..."
              className="!w-[200px]"
            />
            <Select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as "" | ReceiptSource)}
              options={SOURCE_FILTER_OPTIONS}
              className="!w-[200px]"
            />
          </div>
        </div>
        {loading && (
          <div className="px-6 pb-2 text-[12px] text-[#666666]">Đang tải...</div>
        )}
        <DataTable
          columns={columns}
          rows={receipts}
          rowKey={(r) => r.id}
          empty="Chưa có phiếu thu nào"
        />
      </Card>
    </div>
  );
};

export default ReceiptsPage;