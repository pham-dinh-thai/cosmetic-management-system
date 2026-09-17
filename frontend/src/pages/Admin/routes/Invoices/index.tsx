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
  invoicesService,
  INVOICE_STATUS_LABEL,
  type InvoiceStatus,
  type InvoiceSummary,
} from "../../../../services/invoices.service";
import { toast } from "sonner";

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "UNPAID", label: "Chưa thanh toán" },
  { value: "PARTIAL", label: "Thanh toán một phần" },
  { value: "PAID", label: "Đã thanh toán" },
];

const STATUS_BADGE: Record<InvoiceStatus, string> = {
  UNPAID: "bg-[#f6e3e0] text-[#8a3b2e]",
  PARTIAL: "bg-[#f3efd6] text-[#7a6a1e]",
  PAID: "bg-[#e3efe0] text-[#1c3a13]",
};

function formatCurrency(value: number): string {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("vi-VN");
}

function shortId(value: string): string {
  return value ? `${value.slice(0, 8)}…` : "—";
}

const InvoicesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | InvoiceStatus>("");

  const [selected, setSelected] = useState<InvoiceSummary | null>(null);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await invoicesService.getInvoices({
        ...(search ? { search } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      setInvoices(rows);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    void loadInvoices();
  }, [loadInvoices]);

  const totals = useMemo(() => {
    return invoices.reduce(
      (acc, invoice) => {
        acc.total += Number(invoice.totalAmount);
        acc.paid += Number(invoice.paidAmount);
        acc.unpaid += Number(invoice.unpaidBalance);
        return acc;
      },
      { total: 0, paid: 0, unpaid: 0 },
    );
  }, [invoices]);

  const openPaymentForm = (invoice: InvoiceSummary) => {
    setSelected(invoice);
    setAmount(String(invoice.unpaidBalance));
  };

  const closePaymentForm = () => {
    setSelected(null);
    setAmount("");
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Số tiền phải là số dương");
      return;
    }
    if (parsedAmount > Number(selected.unpaidBalance)) {
      toast.error("Số tiền vượt quá công nợ còn lại");
      return;
    }

    setSaving(true);
    try {
      await invoicesService.recordPayment(selected.id, parsedAmount);
      toast.success(
        `Đã ghi nhận thanh toán cho hóa đơn ${selected.code} (sinh phiếu thu tự động)`,
      );
      closePaymentForm();
      await loadInvoices();
    } catch (err) {
      console.error(err);
      toast.error("Không thể ghi nhận thanh toán");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (invoice: InvoiceSummary) => {
    if (!window.confirm(`Xóa hóa đơn ${invoice.code}?`)) return;

    try {
      await invoicesService.deleteInvoice(invoice.id);
      toast.success("Đã xóa hóa đơn");
      await loadInvoices();
    } catch (err) {
      console.error(err);
      toast.error("Không thể xóa hóa đơn");
    }
  };

  const columns: Column<InvoiceSummary>[] = [
    {
      key: "code",
      header: "Mã hóa đơn",
      render: (r) => <span className="font-mono text-[12px]">{r.code}</span>,
    },
    {
      key: "orderId",
      header: "Đơn hàng",
      render: (r) => (
        <span className="font-mono text-[12px] text-[#666666]">
          {shortId(r.orderId)}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Tổng tiền",
      className: "text-right",
      render: (r) => (
        <span className="font-mono">{formatCurrency(Number(r.totalAmount))}</span>
      ),
    },
    {
      key: "paidAmount",
      header: "Đã thu",
      className: "text-right",
      render: (r) => (
        <span className="font-mono text-[#666666]">
          {formatCurrency(Number(r.paidAmount))}
        </span>
      ),
    },
    {
      key: "unpaidBalance",
      header: "Còn nợ",
      className: "text-right",
      render: (r) => (
        <span className="font-mono font-medium text-[#8a3b2e]">
          {formatCurrency(Number(r.unpaidBalance))}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (r) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${STATUS_BADGE[r.status]}`}
        >
          {INVOICE_STATUS_LABEL[r.status]}
        </span>
      ),
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
        <div className="flex items-center justify-end gap-2">
          {Number(r.unpaidBalance) > 0 && (
            <Button variant="ghost" size="sm" onClick={() => openPaymentForm(r)}>
              Thu tiền
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleDelete(r)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1100px] mx-auto">
      <PageHeader
        eyebrow="Quản lý / Thu chi"
        title="Công nợ"
        description="Theo dõi hóa đơn và công nợ khách hàng. Mỗi lần ghi nhận thanh toán, hệ thống tự động sinh phiếu thu tương ứng."
      />

      {selected && (
        <Card>
          <h2
            className="text-[20px] text-[#1c3a13] mb-1"
            style={{ fontWeight: 350 }}
          >
            Ghi nhận thanh toán — {selected.code}
          </h2>
          <p className="text-[13px] text-[#666666] mb-4">
            Công nợ còn lại:{" "}
            <span className="font-mono font-medium text-[#8a3b2e]">
              {formatCurrency(Number(selected.unpaidBalance))}
            </span>
          </p>
          <form onSubmit={handleRecordPayment} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 max-w-sm">
              <span className="text-[12px] text-[#666666]">Số tiền thu *</span>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="VD: 150000"
              />
            </label>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closePaymentForm}>
                Huỷ
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Đang lưu..." : "Xác nhận thu tiền"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>
              Danh sách hóa đơn
            </h2>
            <p className="text-[13px] text-[#666666] mt-1">
              Tổng:{" "}
              <span className="font-mono font-medium text-[#1c3a13]">
                {formatCurrency(totals.total)}
              </span>{" "}
              · Đã thu:{" "}
              <span className="font-mono font-medium text-[#1c3a13]">
                {formatCurrency(totals.paid)}
              </span>{" "}
              · Còn nợ:{" "}
              <span className="font-mono font-medium text-[#8a3b2e]">
                {formatCurrency(totals.unpaid)}
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "" | InvoiceStatus)}
              options={STATUS_FILTER_OPTIONS}
              className="!w-[200px]"
            />
          </div>
        </div>
        {loading && (
          <div className="px-6 pb-2 text-[12px] text-[#666666]">Đang tải...</div>
        )}
        <DataTable
          columns={columns}
          rows={invoices}
          rowKey={(r) => r.id}
          empty="Chưa có hóa đơn nào"
        />
      </Card>
    </div>
  );
};

export default InvoicesPage;
