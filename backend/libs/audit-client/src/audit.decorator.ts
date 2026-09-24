import { SetMetadata } from '@nestjs/common';
import type { Request } from 'express';
import { AuditAction } from './audit-action.enum';

export type AuditEntityIdExtractor = (
  request: Request,
  response?: unknown,
) => string | undefined;

export type AuditOptions = {
  /** Tên loại entity để ghi log (ví dụ: 'category', 'order', 'user'). */
  entityType: string;
  /** Nếu không truyền, mặc định theo HTTP method: POST=CREATE, PUT/PATCH=UPDATE, DELETE=DELETE. */
  action?: AuditAction;
  /** Trích xuất entityId từ request (params) hoặc response value. */
  entityId?: AuditEntityIdExtractor;
  /**
   * Trích xuất actorId từ request. Dùng cho internal endpoint (không có JWT),
   * ví dụ lấy `createdBy` từ body do service khác truyền sang.
   */
  actorId?: (request: Request) => string | undefined;
  /**
   * Ghi log cả khi request thất bại (lỗi từ handler/validation).
   * Mặc định true; set false để chỉ ghi khi thành công.
   */
  recordOnError?: boolean;
};

export const AUDIT_KEY = 'audit-options';

export const Audit = (options: AuditOptions) => SetMetadata(AUDIT_KEY, options);

// ---- Helpers cho entityId ----

/** Lấy id từ path param, ví dụ `/categories/:id` -> `paramId()`. */
export const paramId =
  (name = 'id'): AuditEntityIdExtractor =>
  (request) => {
    const value = request.params[name];
    return typeof value === 'string' ? value : undefined;
  };

/** Lấy id từ response trả về, ví dụ `{ id }` -> `responseId()`. */
export const responseId =
  (name = 'id'): AuditEntityIdExtractor =>
  (_request, response) => {
    if (typeof response !== 'object' || response === null) {
      return undefined;
    }
    const value = (response as Record<string, unknown>)[name];
    return typeof value === 'string' ? value : undefined;
  };

/** Lấy actor id (sub) từ JWT trên request. */
export const userSubId = (): AuditEntityIdExtractor => (request) => {
  const user = (request as Request & { user?: { sub?: string } }).user;
  return user?.sub;
};
