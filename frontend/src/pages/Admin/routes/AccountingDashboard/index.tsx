import React, { useEffect, useState } from "react";
import { PageHeader, Card, Kpi } from "../../../../components/ui/Primitives";
import { invoicesService, INVOICE_STATUS_LABEL, type InvoiceSummary } from "../../../../services/invoices.service";
import { accountingService, PAYMENT_CATEGORY_LABEL, type ReceiptSummary, type PaymentSummary } from "../../../../services/accounting.service";
import { formatVnd } from "../../../../services/overview.service";

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function buildAccountingData(
  invoices: InvoiceSummary[],
  receipts: ReceiptSummary[],
  payments: PaymentSummary[],
) {
  const amountOf = (n: number | undefined | null) => Number(n ?? 0);

  const totalReceivable = invoices.reduce(
    (sum, inv) => sum + amountOf(inv.unpaidBalance),
    0,
  );
  const unpaidCount = invoices.filter((inv) => inv.status !== "PAID").length;
  const todayReceived = receipts
    .filter((r) => isToday(r.createdAt))
    .reduce((sum, r) => sum + amountOf(r.amount), 0);
  const todayPaid = payments
    .filter((p) => isToday(p.createdAt))
    .reduce((sum, p) => sum + amountOf(p.amount), 0);

  const invoiceStatusCounts = (["UNPAID", "PARTIAL", "PAID"] as const).map(
    (status) => ({
      status,
      label: INVOICE_STATUS_LABEL[status],
      count: invoices.filter((inv) => inv.status === status).length,
      amount: invoices
        .filter((inv) => inv.status === status)
        .reduce((sum, inv) => sum + amountOf(inv.unpaidBalance), 0),
    }),
  );

  const recentReceipts = [...receipts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    totalReceivable,
    unpaidCount,
    todayReceived,
    todayPaid,
    invoiceStatusCounts,
    recentReceipts,
    recentPayments,
  };
}

const AccountingDashboard: React.FC = () => {
  const [data, setData] = useState<ReturnType<typeof buildAccountingData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [invoices, receipts, payments] = await Promise.all([
          invoicesService.getInvoices().catch(() => [] as InvoiceSummary[]),
          accountingService.getReceipts().catch(() => [] as ReceiptSummary[]),
          accountingService.getPayments().catch(() => [] as PaymentSummary[]),
        ]);
        if (!active) return;
        setData(buildAccountingData(invoices, receipts, payments));
      } catch (err) {
        if (!active) return;
        setError("Không thể tải dữ liệu thu chi. Vui lòng thử lại.");
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
      eyebrow="Thu chi / Tổng quan"
      title="Tổng quan thu chi"
      description="Công nợ phải thu, dòng tiền thu chi theo thời gian thực."
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

  const totalInvoices = data.invoiceStatusCounts.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="flex flex-col gap-10">
      {header}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Kpi
          label="Công nợ phải thu"
          value={formatVnd(Math.round(data.totalReceivable))}
          caption={`${data.unpaidCount} hóa đơn chưa tất toán`}
          accent="forest"
        />
        <Kpi
          label="Đã thu hôm nay"
          value={formatVnd(Math.round(data.todayReceived))}
          caption="phiếu thu"
          accent="lime"
        />
        <Kpi
          label="Đã chi hôm nay"
          value={formatVnd(Math.round(data.todayPaid))}
          caption="phiếu chi"
          accent="sage"
        />
        <Kpi
          label="Hóa đơn"
          value={String(totalInvoices)}
          caption={`${data.invoiceStatusCounts.find((s) => s.status === "PAID")?.count ?? 0} đã tất toán`}
          accent="olive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
            Công nợ
          </p>
          <h3
            className="mt-2 text-[#1c3a13]"
            style={{ fontWeight: 350, fontSize: "24px", lineHeight: 1.1, letterSpacing: "-0.48px" }}
          >
            Hóa đơn theo trạng thái
          </h3>

          <div className="mt-6 flex flex-col gap-5">
            {data.invoiceStatusCounts.map((s) => {
              const pct = totalInvoices === 0 ? 0 : Math.round((s.count / totalInvoices) * 100);
              return (
                <div key={s.status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] text-[#1c3a13]">{s.label}</span>
                    <span className="text-[12px] font-medium text-[#666666]">
                      {s.count} hóa đơn
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#eeeee9] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor:
                          s.status === "PAID"
                            ? "#1c3a13"
                            : s.status === "PARTIAL"
                            ? "#9f995b"
                            : "#8f3f2a",
                      }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-[#666666]">
                    Còn phải thu {formatVnd(Math.round(s.amount))}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
            Phiếu thu
          </p>
          <h3
            className="mt-2 text-[#1c3a13]"
            style={{ fontWeight: 350, fontSize: "24px", lineHeight: 1.1, letterSpacing: "-0.48px" }}
          >
            Thu gần đây
          </h3>

          {data.recentReceipts.length === 0 ? (
            <p className="py-4 text-[14px] text-[#666666]">Chưa có phiếu thu nào.</p>
          ) : (
            <ol className="flex flex-col">
              {data.recentReceipts.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center gap-5 py-4 border-t border-[#eeeee9] first:border-t-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1c3a13] truncate" style={{ fontWeight: 350, fontSize: "16px" }}>
                      {r.code}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#666666] mt-0.5">
                      {fmtDate(r.createdAt)}
                    </p>
                  </div>
                  <p className="text-right shrink-0 text-[14px] text-[#1c3a13]">
                    +{formatVnd(Number(r.amount ?? 0))}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
            Phiếu chi
          </p>
          <h3
            className="mt-2 text-[#1c3a13]"
            style={{ fontWeight: 350, fontSize: "24px", lineHeight: 1.1, letterSpacing: "-0.48px" }}
          >
            Chi gần đây
          </h3>

          {data.recentPayments.length === 0 ? (
            <p className="py-4 text-[14px] text-[#666666]">Chưa có phiếu chi nào.</p>
          ) : (
            <ol className="flex flex-col">
              {data.recentPayments.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-5 py-4 border-t border-[#eeeee9] first:border-t-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1c3a13] truncate" style={{ fontWeight: 350, fontSize: "16px" }}>
                      {p.code}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#666666] mt-0.5">
                      {PAYMENT_CATEGORY_LABEL[p.category] ?? p.category} · {fmtDate(p.createdAt)}
                    </p>
                  </div>
                  <p className="text-right shrink-0 text-[14px] text-[#8f3f2a]">
                    -{formatVnd(Number(p.amount ?? 0))}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AccountingDashboard;