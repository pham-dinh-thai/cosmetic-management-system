import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import type { UserRole } from "../services/auth.service";
import NotFound from "../pages/NotFound";

interface RoleRouteProps {
  /** Danh sách vai trò được phép (dùng khi không bật anyRole). */
  allowedRoles?: UserRole[];
  /** Bật = mọi vai trò đã đăng nhập đều được vào (không check role cụ thể). */
  anyRole?: boolean;
  /** Các vai trò bị chặn, check sau allowedRoles/anyRole. */
  excludeRoles?: UserRole[];
  children: ReactNode;
}

const RoleRoute: React.FC<RoleRouteProps> = ({
  allowedRoles = [],
  anyRole = false,
  excludeRoles = [],
  children,
}) => {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const allowed = anyRole || (role != null && allowedRoles.includes(role));

  if (!allowed || (role != null && excludeRoles.includes(role))) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export default RoleRoute;