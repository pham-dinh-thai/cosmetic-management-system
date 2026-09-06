import { useEffect, useState } from "react";
import { reportsApi } from "./api";
import type { ReportSummary } from "./type";

export function useReports() {
  const [data, setData] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsApi.fetchReports().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}
