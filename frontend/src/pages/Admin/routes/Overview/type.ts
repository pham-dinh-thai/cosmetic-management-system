import type { OverviewData as ServiceOverviewData } from "../../../../services/overview.service";

export type OverviewData = ServiceOverviewData;
export type RevenueByDay = ServiceOverviewData["revenueByDay"][number];
export type OrderStatusCount = ServiceOverviewData["orderStatusCounts"][number];
export type TopProduct = ServiceOverviewData["topProducts"][number];
