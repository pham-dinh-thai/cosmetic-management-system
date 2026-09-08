import { useLocation } from "react-router-dom";

export function useBasePath(): string {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) {
    return "/admin";
  }
  return "/employee";
}
