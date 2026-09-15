import { overviewService, formatVnd, percentChange } from "../../../../services/overview.service";
import type { OverviewData } from "./type";

export const overviewApi = {
  fetchOverview: (): Promise<OverviewData> => overviewService.fetchOverview(),
  formatVnd,
  percentChange,
};
