export type ResourcePageKey =
  | "overview"
  | "reports"
  | "orders"
  | "customers"
  | "employees"
  | "departments"
  | "suppliers"
  | "products"
  | "categories"
  | "purchase"
  | "inventory"
  | "stock-adjustments"
  | "receipts"
  | "payments"
  | "invoices"
  | "audit-logs"
  | "pos";

const RESOURCE_PREFIXES: [string, ResourcePageKey][] = [
  ["/overview", "overview"],
  ["/reports", "reports"],
  ["/orders", "orders"],
  ["/customers", "customers"],
  ["/employees", "employees"],
  ["/departments", "departments"],
  ["/suppliers", "suppliers"],
  ["/products", "products"],
  ["/categories", "categories"],
  ["/purchase", "purchase"],
  ["/inventory", "inventory"],
  ["/stock-adjustments", "stock-adjustments"],
  ["/receipts", "receipts"],
  ["/payments", "payments"],
  ["/invoices", "invoices"],
  ["/audit-logs", "audit-logs"],
  ["/pos", "pos"],
];

export function getActiveKey(pathname: string): ResourcePageKey | null {
  for (const [prefix, key] of RESOURCE_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return key;
  }
  return null;
}

export function isResourcePath(pathname: string): boolean {
  return getActiveKey(pathname) !== null;
}