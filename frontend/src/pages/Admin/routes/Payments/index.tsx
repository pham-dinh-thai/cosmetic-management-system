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
  PAYMENT_CATEGORY_LABEL,
  PAYMENT_SOURCE_LABEL,
  type PaymentCategory,
  type PaymentSummary,
} from "../../../../services/accounting.service";
import { toast } from "sonner";

const CATEGORY_OPTIONS = [
  { value: "", label: "Tất cả loại chi" },
  { value: "SUPPLIER", label: "Trả nhà cung cấp" },
  { value: "SALARY", label: "Lương" },
  { value: "INFRASTRUCTURE", label: "Cơ sở hạ tầng" },
  { value: "MATERIAL", label: "Vật chất" },
  { value: "OTHER", label: "Khác" },
];

const CATEGORY_CREATE_OPTIONS = CATEGORY_OPTIONS.filter((o) => o.value !== "");

function formatCurrency(value: number): string {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("vi-VN");
}

const PaymentsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<PaymentSummary[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"" | PaymentCategory>("");

  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<PaymentCategory>("SALARY");
  const [note, setNote] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [saving, setSaving] = useState(false);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await accountingService.getPayments({
        ...(search ? { search } : {}),
        ...(categoryFilter ? { category: categoryFilter } : {}),
      });
      setPayments(rows);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách phiếu chi");
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  const total = useMemo(
    () => payments.reduce((sum, p) => sum + Number(p.amount), 0),
    [payments],
  );

  const resetForm = () => {
    setAmount("");
    setNote("");
    setSupplierId("");
    setCategory("SALARY");
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
      const created = await accountingService.createPayment({
        amount: parsedAmount,
        category,
        note: note.trim() || undefined,
        supplierId: supplierId.trim() || undefined,
      });
      toast.success(`Đã tạo phiếu chi ${created.code}`);
      resetForm();
      setShowForm(false);
      await loadPayments();
    } catch (err) {
      console.error(err);
      toast.error("Không thể tạo phiếu chi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (payment: PaymentSummary) => {
    if (!window.confirm(`Xóa phiếu chi ${payment.code}?`)) return;

    try {
      await accountingService.deletePayment(payment.id);
      toast.success("Đã xóa phiếu chi");
      await loadPayments();
    } catch (err) {
      console.error(err);
      toast.error("Không thể xóa phiếu chi");
    }
  };

  const columns: Column<PaymentSummary>[] = [
    {
      key: "code",
      header: "Mã phiếu",
      render: (p) => <span className="font-mono text-[12px]">{p.code}</span>,
    },
    {
      key: "amount",
      header: "Số tiền",
      className: "text-right",
      render: (p) => (
        <span className="font-mono font-medium text-[#b04747]">
          -{formatCurrency(Number(p.amount))}
        </span>
      ),
    },
    {
      key: "category",
      header: "Loại chi",
      render: (p) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#eeeee9] text-[#666666]">
          {PAYMENT_CATEGORY_LABEL[p.category]}
        </span>
      ),
    },
    {
      key: "source",
      header: "Nguồn",
      render: (p) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
            p.source === "AUTO_PURCHASE"
              ? "bg-[#e3efe0] text-[#1c3a13]"
              : "bg-[#eeeee9] text-[#666666]"
          }`}
        >
          {PAYMENT_SOURCE_LABEL[p.source]}
        </span>
      ),
    },
    {
      key: "note",
      header: "Ghi chú",
      render: (p) => <span className="text-[#666666]">{p.note || "—"}</span>,
    },
    {
      key: "createdAt",
      header: "Thời gian",
      className: "text-right",
      render: (p) => <span>{formatDate(p.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (p) => (
        <Button variant="ghost" size="sm" onClick={() => handleDelete(p)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1100px] mx-auto">
      <PageHeader
        eyebrow="Quản lý / Thu chi"
        title="Phiếu chi"
        description="Ghi nhận tiền chi ra. Phiếu chi tự động được tạo khi hoàn tất phiếu nhập, hoặc nhập thủ công cho lương, cơ sở hạ tầng, vật chất..."
        actions={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Đóng" : "+ Phiếu chi"}
          </Button>
        }
      />

      {showForm && (
        <Card>
          <h2 className="text-[20px] text-[#1c3a13] mb-4" style={{ fontWeight: 350 }}>
            Tạo phiếu chi thủ công
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
                  placeholder="VD: 5000000"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] text-[#666666]">Loại chi *</span>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PaymentCategory)}
                  options={CATEGORY_CREATE_OPTIONS}
                />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] text-[#666666]">
                Mã nhà cung cấp (tuỳ chọn)
              </span>
              <Input
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                placeholder="UUID nhà cung cấp"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] text-[#666666]">Ghi chú</span>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nội dung chi"
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
                {saving ? "Đang lưu..." : "Lưu phiếu chi"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>
              Danh sách phiếu chi
            </h2>
            <p className="text-[13px] text-[#666666] mt-1">
              Tổng chi:{" "}
              <span className="font-mono font-medium text-[#b04747]">
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
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as "" | PaymentCategory)
              }
              options={CATEGORY_OPTIONS}
              className="!w-[200px]"
            />
          </div>
        </div>
        {loading && (
          <div className="px-6 pb-2 text-[12px] text-[#666666]">Đang tải...</div>
        )}
        <DataTable
          columns={columns}
          rows={payments}
          rowKey={(p) => p.id}
          empty="Chưa có phiếu chi nào"
        />
      </Card>
    </div>
  );
};

export default PaymentsPage;