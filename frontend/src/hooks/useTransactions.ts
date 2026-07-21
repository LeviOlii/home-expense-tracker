import { useCallback, useEffect, useState } from "react";
import type {
  Transaction,
  CreateTransactionRequest,
  ListTransactionsParams,
} from "@/types/Transaction";
import type { PaginatedResponse } from "@/types/Pagination";
import { listTransactions, createTransaction }  from "@/api/transaction";

const EMPTY_PAGE: PaginatedResponse<Transaction> = {
  items: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

export function useTransactions() {
  const [data, setData] = useState<PaginatedResponse<Transaction>>(EMPTY_PAGE);
  const [filters, setFilters] = useState<ListTransactionsParams>({ page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listTransactions(filters);
      setData(result);
    } catch {
      setError("Could not load transactions.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  async function addTransaction(payload: CreateTransactionRequest): Promise<void> {
    await createTransaction(payload);
    await refetch();
  }

  function goToPage(page: number) {
    setFilters((prev) => ({ ...prev, page }));
  }

  function updateFilters(next: Partial<ListTransactionsParams>) {
    // Changing a filter always resets back to page 1 — otherwise you could
    // land on a page that no longer exists after narrowing the results.
    setFilters((prev) => ({ ...prev, ...next, page: 1 }));
  }

  return { data, filters, loading, error, refetch, addTransaction, goToPage, updateFilters };
}
