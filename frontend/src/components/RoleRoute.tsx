import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import type { UserRole } from "../services/auth.service";
import NotFound from "../pages/NotFound";

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export default RoleRoute;
