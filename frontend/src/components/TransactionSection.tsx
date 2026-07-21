import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeftRight, Loader2, Plus } from "lucide-react";
import type {
  Transaction,
  CreateTransactionRequest,
  ListTransactionsParams,
} from "@/types/Transaction";
import type { TransactionType } from "@/types/Transaction";
import type { Person } from "@/types/Person";
import type { PaginatedResponse } from "@/types/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionSectionProps {
  data: PaginatedResponse<Transaction>;
  loading: boolean;
  error: string | null;
  filters: ListTransactionsParams;
  people: Person[];
  onCreate: (data: CreateTransactionRequest) => Promise<unknown>;
  onGoToPage: (page: number) => void;
  onUpdateFilters: (filters: Partial<ListTransactionsParams>) => void;
}

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function TransactionSection({
  data,
  loading,
  error,
  filters,
  people,
  onCreate,
  onGoToPage,
  onUpdateFilters,
}: TransactionSectionProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("Expense");
  const [personId, setPersonId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedPerson = useMemo(
    () => people.find((p) => p.id === personId),
    [people, personId],
  );
  const selectedPersonLabel = useMemo(
    () => selectedPerson?.name ?? "Select a person…",
    [selectedPerson],
  );
  const selectedFilterPersonLabel = useMemo(() => {
    if (!filters.personId) return "All people";
    return people.find((p) => p.id === filters.personId)?.name ?? "All people";
  }, [filters.personId, people]);
  const isMinorSelected = !!selectedPerson && selectedPerson.age < 18;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    const parsedAmount = Number(amount);
    if (!description.trim()) {
      setFormError("Description is required.");
      return;
    }
    if (amount === "" || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError("Enter a valid amount greater than zero.");
      return;
    }
    if (!personId) {
      setFormError("Select a person.");
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({
        description: description.trim(),
        amount: parsedAmount,
        type,
        personId,
      });
      setDescription("");
      setAmount("");
      setPersonId("");
      setType("Expense");
    } catch {
      setFormError("Could not add this transaction. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handlePersonChange(id: string) {
    setPersonId(id);
    const person = people.find((p) => p.id === id);
    if (person && person.age < 18) {
      setType("Expense");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <Card className="border border-slate-200/80 bg-white/80 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-700">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Add transaction</CardTitle>
              <p className="text-sm text-slate-500">
                Choose a person and log the expense or income.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="tx-person">Person</Label>
              <Select
                value={personId}
                onValueChange={(value) => handlePersonChange(value || "")}
              >
                <SelectTrigger
                  id="tx-person"
                  className="h-10 w-full rounded-xl border-slate-200 bg-slate-50/80"
                >
                  <span className="truncate">{selectedPersonLabel}</span>
                </SelectTrigger>
                <SelectContent>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tx-description">Description</Label>
              <Input
                id="tx-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Groceries"
                className="h-10 rounded-xl border-slate-200 bg-slate-50/80"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tx-amount">Amount</Label>
              <Input
                id="tx-amount"
                type="number"
                min={0.01}
                max={1_000_000}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-10 rounded-xl border-slate-200 bg-slate-50/80"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tx-type">Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as TransactionType)}
              >
                <SelectTrigger
                  id="tx-type"
                  className="h-10 w-full rounded-xl border-slate-200 bg-slate-50/80"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Income" disabled={isMinorSelected}>
                    Income
                  </SelectItem>
                </SelectContent>
              </Select>
              {isMinorSelected && (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  This person is under 18 — only expenses are allowed.
                </p>
              )}
            </div>

            {formError && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {formError}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 hover:from-violet-700 hover:to-indigo-700"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add transaction
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-slate-200/80 bg-white/80 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
        <CardHeader className="border-b border-slate-200/70 pb-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg">
                Transactions ({data.totalItems})
              </CardTitle>
              <p className="text-sm text-slate-500">
                A polished timeline of the latest household movements.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.personId ?? "all"}
                onValueChange={(value) =>
                  onUpdateFilters({
                    personId: value === "all" ? undefined : value || undefined,
                  })
                }
              >
                <SelectTrigger className="h-9 w-full rounded-xl border-slate-200 bg-slate-50/80 sm:w-40">
                  <span className="truncate">{selectedFilterPersonLabel}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All people</SelectItem>
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.type ?? "all"}
                onValueChange={(value) =>
                  onUpdateFilters({
                    type:
                      value === "all"
                        ? undefined
                        : (value as TransactionType | undefined),
                  })
                }
              >
                <SelectTrigger className="h-9 w-full rounded-xl border-slate-200 bg-slate-50/80 sm:w-36">
                  <span className="truncate">
                    {filters.type ? filters.type : "All types"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          {loading && (
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Loading transactions…
            </p>
          )}
          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          )}

          {!loading && !error && data.items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-sm text-slate-500">
              No transactions match these filters.
            </div>
          )}

          {!loading && data.items.length > 0 && (
            <>
              <div className="overflow-hidden rounded-2xl border border-slate-200/80">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="px-4 py-3">Description</TableHead>
                      <TableHead className="px-4 py-3">Person</TableHead>
                      <TableHead className="px-4 py-3">Type</TableHead>
                      <TableHead className="px-4 py-3 text-right">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((tx) => {
                      const person = people.find((p) => p.id === tx.personId);
                      return (
                        <TableRow key={tx.id} className="hover:bg-slate-50/70">
                          <TableCell className="px-4 py-3 font-medium text-slate-900">
                            {tx.description}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-slate-600">
                            {person?.name ?? "—"}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <Badge
                              variant={
                                tx.type === "Income" ? "income" : "expense"
                              }
                            >
                              {tx.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-right font-semibold text-slate-900">
                            {currency.format(tx.amount)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Page {data.page} of {Math.max(data.totalPages, 1)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.page <= 1}
                    onClick={() => onGoToPage(data.page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.page >= data.totalPages}
                    onClick={() => onGoToPage(data.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
