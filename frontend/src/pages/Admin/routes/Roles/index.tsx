import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  PageHeader,
  Input,
  Select,
  Button,
} from "../../../../components/ui/Primitives";
import {
  rolesService,
  type RoleSummary,
  type RoleDetail,
} from "../../../../services/roles.service";
import {
  permissionsService,
  RESOURCE_OPTIONS,
  ACTION_OPTIONS,
  resourceLabel,
  actionLabel,
  type PermissionSummary,
} from "../../../../services/permissions.service";
import { friendlyErrorMessage } from "../../../../lib/apiError";

const ACTIVE_BADGE =
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] bg-[#e3ecd9] text-[#1c3a13]";
const INACTIVE_BADGE =
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] bg-[#eeeee9] text-[#666666]";

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [permissions, setPermissions] = useState<PermissionSummary[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [roleDetail, setRoleDetail] = useState<RoleDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newRoleName, setNewRoleName] = useState("");
  const [newPermissionResource, setNewPermissionResource] = useState(
    RESOURCE_OPTIONS[0]?.value ?? "",
  );
  const [newPermissionAction, setNewPermissionAction] = useState(
    ACTION_OPTIONS[0]?.value ?? "",
  );

  const loadRolesAndPermissions = useCallback(async () => {
    setRolesLoading(true);
    setPermissionsLoading(true);
    try {
      const [roleRows, permissionRows] = await Promise.all([
        rolesService.findAll(),
        permissionsService.findAll(),
      ]);
      setRoles(roleRows);
      setPermissions(permissionRows);
      setSelectedRoleId((current) =>
        current && roleRows.some((r) => r.id === current)
          ? current
          : (roleRows[0]?.id ?? null),
      );
    } catch (error) {
      toast.error(friendlyErrorMessage(error, "Không tải được danh sách"));
    } finally {
      setRolesLoading(false);
      setPermissionsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRolesAndPermissions();
  }, [loadRolesAndPermissions]);

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) ?? null,
    [roles, selectedRoleId],
  );

  const grantedIds = useMemo(
    () => new Set((roleDetail?.permissions ?? []).map((p) => p.id)),
    [roleDetail],
  );

  const selectRole = useCallback(async (id: string) => {
    setSelectedRoleId(id);
    setDetailLoading(true);
    setRoleDetail(null);
    try {
      const detail = await rolesService.findById(id);
      setRoleDetail(detail);
    } catch (error) {
      toast.error(friendlyErrorMessage(error, "Không tải được quyền của vai trò"));
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      toast.error("Vui lòng nhập tên vai trò");
      return;
    }

    try {
      await rolesService.create(newRoleName.trim());
      toast.success("Đã tạo vai trò mới");
      setNewRoleName("");

      const refreshed = await rolesService.findAll();
      setRoles(refreshed);
      const newId = newRoleName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
      const target = refreshed.find((r) => r.id === newId);
      await selectRole(target?.id ?? refreshed[0]?.id ?? "");
      if (!target) {
        setSelectedRoleId(refreshed[0]?.id ?? null);
      }
    } catch (error) {
      toast.error(friendlyErrorMessage(error, "Không tạo được vai trò"));
    }
  };

  const handleToggleRoleActive = async (role: RoleSummary) => {
    try {
      if (role.isActive) {
        await rolesService.deactivate(role.id);
        toast.success(`Đã vô hiệu hoá vai trò "${role.name}"`);
      } else {
        await rolesService.activate(role.id);
        toast.success(`Đã kích hoạt vai trò "${role.name}"`);
      }

      setRoles((prev) =>
        prev.map((r) =>
          r.id === role.id ? { ...r, isActive: !r.isActive } : r,
        ),
      );
      if (roleDetail?.id === role.id) {
        setRoleDetail({ ...roleDetail, isActive: !role.isActive });
      }
    } catch (error) {
      toast.error(friendlyErrorMessage(error, "Không cập nhật được vai trò"));
    }
  };

  const handleTogglePermission = async (permission: PermissionSummary) => {
    if (!selectedRole || !roleDetail) return;
    if (!selectedRole.isActive) {
      toast.error("Vai trò đang vô hiệu hoá, không thể cập nhật quyền");
      return;
    }
    if (!permission.isActive) {
      toast.error("Quyền này đang vô hiệu hoá, không thể gán cho vai trò");
      return;
    }

    const nextIds = new Set(grantedIds);
    if (nextIds.has(permission.id)) {
      nextIds.delete(permission.id);
    } else {
      nextIds.add(permission.id);
    }

    const previous = roleDetail;
    setRoleDetail({
      ...roleDetail,
      permissions: permissions.filter((p) => nextIds.has(p.id)),
    });
    setSaving(true);
    try {
      await rolesService.updatePermissions(selectedRole.id, [...nextIds]);
      toast.success(
        nextIds.has(permission.id)
          ? `Đã cấp quyền "${actionLabel(permission.action)}" cho "${selectedRole.name}"`
          : `Đã thu hồi quyền "${actionLabel(permission.action)}" khỏi "${selectedRole.name}"`,
      );
    } catch (error) {
      setRoleDetail(previous);
      toast.error(friendlyErrorMessage(error, "Không cập nhật được quyền"));
    } finally {
      setSaving(false);
    }
  };

  const handleAddPermission = async () => {
    if (!newPermissionResource || !newPermissionAction) return;

    try {
      await permissionsService.create(
        newPermissionResource,
        newPermissionAction,
      );
      toast.success("Đã thêm quyền mới");
      const refreshed = await permissionsService.findAll();
      setPermissions(refreshed);
    } catch (error) {
      toast.error(friendlyErrorMessage(error, "Không thêm được quyền"));
    }
  };

  const handleTogglePermissionActive = async (permission: PermissionSummary) => {
    try {
      if (permission.isActive) {
        await permissionsService.deactivate(permission.id);
        toast.success("Đã vô hiệu hoá quyền");
      } else {
        await permissionsService.activate(permission.id);
        toast.success("Đã kích hoạt quyền");
      }

      setPermissions((prev) =>
        prev.map((p) =>
          p.id === permission.id ? { ...p, isActive: !p.isActive } : p,
        ),
      );
      if (grantedIds.has(permission.id) && roleDetail) {
        setRoleDetail({
          ...roleDetail,
          permissions: roleDetail.permissions.map((p) =>
            p.id === permission.id
              ? { ...p, isActive: !p.isActive }
              : p,
          ),
        });
      }
    } catch (error) {
      toast.error(friendlyErrorMessage(error, "Không cập nhật được quyền"));
    }
  };

  const permissionGroups = useMemo(() => {
    const groups = new Map<string, PermissionSummary[]>();
    for (const permission of permissions) {
      const list = groups.get(permission.resource) ?? [];
      list.push(permission);
      groups.set(permission.resource, list);
    }
    return [...groups.entries()];
  }, [permissions]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Quản trị hệ thống"
        title="Phân quyền"
        description="Chọn vai trò ở bên trái để xem và cập nhật quyền truy cập. Quyền cập nhật sẽ được áp dụng ngay lập tức."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,340px)_1fr] gap-6 items-start">
        {/* Panel: Vai trò */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold tracking-[0.02em] text-[#1c3a13]">
              Vai trò
            </h2>
            <span className="text-[12px] text-[#666666]">{roles.length} vai trò</span>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Tên vai trò mới…"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleAddRole();
              }}
            />
            <Button
              size="sm"
              variant="outline"
              className="shrink-0"
              onClick={() => void handleAddRole()}
              type="button"
            >
              Thêm
            </Button>
          </div>

          <div className="flex flex-col gap-1.5 max-h-[520px] overflow-y-auto pr-1">
            {rolesLoading && <p className="text-[13px] text-[#666666] py-4 text-center">Đang tải…</p>}
            {!rolesLoading && roles.length === 0 && (
              <p className="text-[13px] text-[#666666] py-4 text-center">
                Chưa có vai trò nào. Hãy tạo vai trò đầu tiên.
              </p>
            )}
            {roles.map((role) => {
              const isSelected = role.id === selectedRoleId;
              return (
                <div
                  key={role.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => void selectRole(role.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      void selectRole(role.id);
                    }
                  }}
                  className={`flex cursor-pointer flex-col items-start gap-1.5 rounded-xl border px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "border-[#1c3a13] bg-[#e3ecd9]"
                      : "border-[#eeeee9] bg-transparent hover:border-[#c4c7c4]"
                  }`}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="font-medium text-[14px] text-[#1c3a13] first-letter:uppercase">
                      {role.name}
                    </span>
                    <span className={role.isActive ? ACTIVE_BADGE : INACTIVE_BADGE}>
                      {role.isActive ? "Hoạt động" : "Tạm ngưng"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleToggleRoleActive(role);
                    }}
                    className="text-[12px] text-[#666666] underline-offset-2 hover:text-[#1c3a13] hover:underline"
                  >
                    {role.isActive ? "Vô hiệu hoá" : "Kích hoạt"}
                  </button>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] leading-[1.5] text-[#666666]">
            Vai trò bị vô hiệu hoá sẽ không thể cập nhật quyền. Nhân viên gán vai
            trò này sẽ mất quyền truy cập tương ứng.
          </p>
        </Card>

        {/* Panel: Quyền */}
        <Card className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold tracking-[0.02em] text-[#1c3a13]">
                Quyền của vai trò{" "}
                <span className="first-letter:uppercase">“{selectedRole?.name ?? "…"}”</span>
              </h2>
              {selectedRole && !selectedRole.isActive && (
                <p className="mt-1 text-[12px] text-[#b45309]">
                  Vai trò đang tạm ngưng — cần kích hoạt lại để cập nhật quyền.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <div className="w-40">
                <Select
                  options={RESOURCE_OPTIONS}
                  value={newPermissionResource}
                  onChange={(e) => setNewPermissionResource(e.target.value)}
                />
              </div>
              <div className="w-36">
                <Select
                  options={ACTION_OPTIONS}
                  value={newPermissionAction}
                  onChange={(e) => setNewPermissionAction(e.target.value)}
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => void handleAddPermission()}
              >
                + Thêm quyền
              </Button>
            </div>
          </div>

          {permissionsLoading || detailLoading ? (
            <p className="text-[13px] text-[#666666] py-10 text-center">Đang tải…</p>
          ) : permissionGroups.length === 0 ? (
            <p className="text-[13px] text-[#666666] py-10 text-center">
              Chưa có quyền nào.
            </p>
          ) : !roleDetail ? (
            <p className="text-[13px] text-[#666666] py-10 text-center">
              Chọn một vai trò để xem quyền.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {permissionGroups.map(([resource, items]) => (
                <div key={resource}>
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#666666]">
                    {resourceLabel(resource)}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {items.map((permission) => {
                      const granted = grantedIds.has(permission.id);
                      const editable =
                        selectedRole?.isActive &&
                        permission.isActive &&
                        !saving;
                      return (
                        <label
                          key={permission.id}
                          className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 transition-colors ${
                            granted
                              ? "border-[#1c3a13] bg-[#e3ecd9]"
                              : "border-[#eeeee9] hover:border-[#c4c7c4]"
                          } ${!permission.isActive ? "opacity-55" : ""}`}
                        >
                          <span className="flex flex-col gap-0.5">
                            <span className="text-[13px] font-medium text-[#1c3a13]">
                              {actionLabel(permission.action)}
                            </span>
                            <span className="font-mono text-[11px] text-[#666666]">
                              {permission.id}
                            </span>
                          </span>
                          <span className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={!roleDetail}
                              onClick={() => void handleTogglePermissionActive(permission)}
                              className="text-[11px] text-[#666666] underline-offset-2 hover:text-[#1c3a13] hover:underline"
                            >
                              {permission.isActive ? "Vô hiệu hoá" : "Kích hoạt"}
                            </button>
                            <input
                              type="checkbox"
                              checked={granted}
                              disabled={!editable}
                              onChange={() => void handleTogglePermission(permission)}
                              className="h-4 w-4 accent-[#1c3a13] disabled:cursor-not-allowed"
                            />
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RolesPage;