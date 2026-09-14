export type ResourcePageKey =
  | "orders"
  | "customers"
  | "employees"
  | "departments"
  | "suppliers"
  | "products"
  | "categories"
  | "purchase"
  | "inventory"
  | "pos";

const RESOURCE_PREFIXES: [string, ResourcePageKey][] = [
  ["/orders", "orders"],
  ["/customers", "customers"],
  ["/employees", "employees"],
  ["/departments", "departments"],
  ["/suppliers", "suppliers"],
  ["/products", "products"],
  ["/categories", "categories"],
  ["/purchase", "purchase"],
  ["/inventory", "inventory"],
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
