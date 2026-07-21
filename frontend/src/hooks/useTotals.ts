import { useCallback, useEffect, useState } from "react";
import type { TotalsResponse } from "@/types/Totals";
import { getTotals } from "@/api/people";

export function useTotals() {
  const [totals, setTotals] = useState<TotalsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTotals();
      setTotals(result);
    } catch {
      setError("Could not load totals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { totals, loading, error, refetch };
}
