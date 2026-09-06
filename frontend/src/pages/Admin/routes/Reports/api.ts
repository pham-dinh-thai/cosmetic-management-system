import type { ReportSummary } from "./type";

export const reportsApi = {
  fetchReports: async (): Promise<ReportSummary> => {
    return {
      totalRevenue: 158000000,
      totalOrders: 420,
      avgOrderValue: 376190,
      topCategory: "Chăm sóc da mặt",
    };
  },
};
