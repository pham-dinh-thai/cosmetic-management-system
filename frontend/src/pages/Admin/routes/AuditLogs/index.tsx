import React, { useCallback, useEffect, useState } from "react";
import {
  PageHeader,
  Button,
  Card,
  Input,
  Select,
} from "../../../../components/ui/Primitives";
import {
  auditLogsService,
  type AuditAction,
  type AuditLogDetail,
  type AuditLogSummary,
  actionBadgeClass,
  actionLabel,
  entityTypeLabel,
  AUDIT_ACTION_OPTIONS,
  AUDIT_ENTITY_TYPE_OPTIONS,
} from "../../../../services/audit-logs.service";
import { toast } from "sonner";

const PAGE_SIZE = 20;

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("vi-VN");
}

function shortId(value: string | null): string {
  return value ? `${value.slice(0, 8)}…` : "—";
}

function JsonBlock({
  data,
  title,
}: {
  data: Record<string, unknown> | null;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
        {title}
      </p>
      {data ? (
        <pre className="max-h-[260px] overflow-auto rounded-lg border border-[#eeeee9] bg-[#fcfcf7] p-3 text-[12px] leading-[1.6] text-[#1c3a13]">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <span className="text-[13px] text-[#666666]">—</span>
      )}
    </div>
  );
}

const AuditLogsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AuditLogSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<"" | AuditAction>("");
  const [entityFilter, setEntityFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selected, setSelected] = useState<AuditLogDetail | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await auditLogsService.findAll({
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(actionFilter ? { action: actionFilter } : {}),
        ...(entityFilter ? { entityType: entityFilter } : {}),
        ...(fromDate ? { fromDate } : {}),
        ...(toDate ? { toDate } : {}),
        page,
        limit: PAGE_SIZE,
      });
      setItems(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải nhật ký hoạt động");
    } finally {
      setLoading(false);
    }
  }, [search, actionFilter, entityFilter, fromDate, toDate, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const openDetail = async (summary: AuditLogSummary) => {
    setLoadingId(summary.id);
    try {
      const detail = await auditLogsService.findById(summary.id);
      setSelected(detail);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải chi tiết nhật ký");
    } finally {
      setLoadingId(null);
    }
  };

  const columns: Array<{
    key: string;
    header: string;
    className?: string;
    render: (row: AuditLogSummary) => React.ReactNode;
  }> = [
    {
      key: "createdAt",
      header: "Thời gian",
      className: "text-right",
      render: (r) => (
        <span className="whitespace-nowrap">{formatDate(r.createdAt)}</span>
      ),
    },
    {
      key: "action",
      header: "Hành động",
      render: (r) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${actionBadgeClass(r.action)}`}
        >
          {actionLabel(r.action)}
        </span>
      ),
    },
    {
      key: "actor",
      header: "Người thực hiện",
      render: (r) => (
        <div className="flex flex-col">
          <span>{r.actorName || "Hệ thống"}</span>
          {r.actorId && (
            <span className="font-mono text-[11px] text-[#666666]">
              {shortId(r.actorId)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "entityType",
      header: "Đối tượng",
      render: (r) => <span>{entityTypeLabel(r.entityType)}</span>,
    },
    {
      key: "entityId",
      header: "Mã đối tượng",
      render: (r) => (
        <span className="font-mono text-[12px] text-[#666666]">
          {shortId(r.entityId)}
        </span>
      ),
    },
    {
      key: "ipAddress",
      header: "IP",
      render: (r) => (
        <span className="font-mono text-[12px] text-[#666666]">
          {r.ipAddress || "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto">
      <PageHeader
        eyebrow="Quản trị / Hệ thống"
        title="Nhật ký hoạt động"
        description="Theo dõi mọi thay đổi dữ liệu và các sự kiện đăng nhập trong hệ thống (danh sách chỉ dành cho quản trị viên)."
        actions={
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => void load()}
          >
            Làm mới
          </Button>
        }
      />

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 pb-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] text-[#666666]">Tìm kiếm</span>
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Đối tượng / mã / người thực hiện..."
                className="!w-[240px]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] text-[#666666]">Hành động</span>
              <Select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value as "" | AuditAction);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "Tất cả hành động" },
                  ...AUDIT_ACTION_OPTIONS,
                ]}
                className="!w-[180px]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] text-[#666666]">Đối tượng</span>
              <Select
                value={entityFilter}
                onChange={(e) => {
                  setEntityFilter(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "Tất cả đối tượng" },
                  ...AUDIT_ENTITY_TYPE_OPTIONS,
                ]}
                className="!w-[200px]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] text-[#666666]">Từ ngày</span>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="!w-[170px]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] text-[#666666]">Đến ngày</span>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="!w-[170px]"
              />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-[#666666]">
              Tổng cộng{" "}
              <span className="font-mono font-medium text-[#1c3a13]">
                {total.toLocaleString("vi-VN")}
              </span>{" "}
              bản ghi
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                Trước
              </Button>
              <span className="text-[13px] text-[#666666] whitespace-nowrap">
                Trang {page} / {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Tiếp
              </Button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="px-6 pb-2 text-[12px] text-[#666666]">
            Đang tải...
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#eeeee9]">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={`px-5 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666] ${c.className ?? ""}`}
                  >
                    {c.header}
                  </th>
                ))}
                <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-5 py-12 text-center text-[14px] text-[#666666]"
                  >
                    {loading ? "Đang tải..." : "Chưa có bản ghi nhật ký nào"}
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => void openDetail(row)}
                    className={`cursor-pointer transition-colors hover:bg-[#f5f5ef] ${
                      selected?.id === row.id ? "bg-[#f3efd6]" : ""
                    }`}
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`px-5 py-4 text-[14px] text-[#1c3a13] border-t border-[#eeeee9] ${c.className ?? ""}`}
                      >
                        {c.render(row)}
                      </td>
                    ))}
                    <td className="px-5 py-4 text-right border-t border-[#eeeee9]">
                      <span className="text-[#666666]">
                        {loadingId === row.id ? "Đang tải..." : "→"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <Card>
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2
                className="text-[20px] text-[#1c3a13]"
                style={{ fontWeight: 350 }}
              >
                Chi tiết nhật ký — {entityTypeLabel(selected.entityType)}
              </h2>
              <p className="text-[13px] text-[#666666] mt-1">
                {actionLabel(selected.action)} lúc {formatDate(selected.createdAt)}
                {" · "}IP:{" "}
                <span className="font-mono">{selected.ipAddress || "—"}</span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelected(null)}
            >
              Đóng
            </Button>
          </div>

          {selected.userAgent && (
            <p className="text-[12px] text-[#666666] mb-4 break-all">
              {selected.userAgent}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JsonBlock title="Trước khi thay đổi (before)" data={selected.before} />
            <JsonBlock title="Sau khi thay đổi (after)" data={selected.after} />
            <div className="md:col-span-2">
              <JsonBlock title="Metadata" data={selected.metadata} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AuditLogsPage;