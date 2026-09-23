import api from "../config/axios";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "VIEW"
  | "EXPORT"
  | "OTHER";

export interface AuditLogSummary {
  id: string;
  actorId: string | null;
  actorName: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface AuditLogDetail {
  id: string;
  actorId: string | null;
  actorName: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AuditLogQuery {
  search?: string;
  action?: AuditAction;
  entityType?: string;
  entityId?: string;
  actorId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogResult {
  items: AuditLogSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const auditLogsService = {
  async findAll(query?: AuditLogQuery): Promise<AuditLogResult> {
    const { data } = await api.get<AuditLogResult>("/audit-logs", {
      params: query,
    });
    return data;
  },

  async findById(id: string): Promise<AuditLogDetail> {
    const { data } = await api.get<AuditLogDetail>(`/audit-logs/${id}`);
    return data;
  },
};

export const AUDIT_ACTION_LABEL: Record<AuditAction, string> = {
  CREATE: "Thêm mới",
  UPDATE: "Cập nhật",
  DELETE: "Xóa",
  LOGIN: "Đăng nhập",
  LOGOUT: "Đăng xuất",
  VIEW: "Xem",
  EXPORT: "Xuất dữ liệu",
  OTHER: "Khác",
};

const AUDIT_ACTION_COLOR: Record<AuditAction, string> = {
  CREATE: "bg-[#e3efe0] text-[#1c3a13]",
  UPDATE: "bg-[#f3efd6] text-[#7a6a1e]",
  DELETE: "bg-[#f6e3e0] text-[#8a3b2e]",
  LOGIN: "bg-[#d3eff0] text-[#1e5c63]",
  LOGOUT: "bg-[#eeeee9] text-[#666666]",
  VIEW: "bg-[#eeeee9] text-[#666666]",
  EXPORT: "bg-[#e3efe0] text-[#1c3a13]",
  OTHER: "bg-[#eeeee9] text-[#666666]",
};

const ENTITY_TYPE_LABELS: Record<string, string> = {
  "auth-user": "Người dùng (auth)",
  role: "Vai trò",
  user: "Tài khoản",
  department: "Phòng ban",
  employee: "Nhân viên",
  customer: "Khách hàng",
  "customer-address": "Địa chỉ khách hàng",
  "customer-phone": "SĐT khách hàng",
  category: "Danh mục",
  supplier: "Nhà cung cấp",
  cosmetic: "Sản phẩm",
  "cosmetic-variant": "Biến thể sản phẩm",
  inventory: "Kho",
  "inventory-batch": "Lô hàng",
  "stock-adjustment": "Điều chỉnh kho",
  "purchase-order": "Phiếu nhập",
  order: "Đơn hàng",
  invoice: "Hóa đơn",
  receipt: "Phiếu thu",
  payment: "Phiếu chi",
};

export function entityTypeLabel(entityType: string): string {
  return ENTITY_TYPE_LABELS[entityType] ?? entityType;
}

export function actionLabel(action: AuditAction): string {
  return AUDIT_ACTION_LABEL[action] ?? action;
}

export function actionBadgeClass(action: AuditAction): string {
  return AUDIT_ACTION_COLOR[action] ?? AUDIT_ACTION_COLOR.OTHER;
}

export const AUDIT_ACTION_OPTIONS = (
  Object.keys(AUDIT_ACTION_LABEL) as AuditAction[]
).map((value) => ({ value, label: AUDIT_ACTION_LABEL[value] }));

export const AUDIT_ENTITY_TYPE_OPTIONS = Object.keys(ENTITY_TYPE_LABELS).map(
  (value) => ({ value, label: ENTITY_TYPE_LABELS[value] }),
);