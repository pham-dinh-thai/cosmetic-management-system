import { useCallback, useEffect, useState } from "react";
import { reportsApi } from "./api";
import type { FullReportsData, ReportType, TimeRangeOption } from "./type";

export function useReports() {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("30");
  const [reportType, setReportType] = useState<ReportType>("revenue");
  const [data, setData] = useState<FullReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const loadData = useCallback(async (range: TimeRangeOption) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reportsApi.fetchFullReports(range);
      setData(result);
    } catch (err: unknown) {
      console.error("Failed to load reports data:", err);
      setError("Không thể tải dữ liệu báo cáo thống kê. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(timeRange);
  }, [timeRange, loadData]);

  const handleExportCsv = useCallback(() => {
    if (!data) return;
    try {
      setExporting(true);
      reportsApi.exportCsv(data, reportType);
    } catch (err) {
      console.error("Failed to export CSV:", err);
    } finally {
      setExporting(false);
    }
  }, [data, reportType]);

  return {
    timeRange,
    setTimeRange,
    reportType,
    setReportType,
    data,
    loading,
    error,
    exporting,
    refetch: () => loadData(timeRange),
    exportCsv: handleExportCsv,
  };
}
