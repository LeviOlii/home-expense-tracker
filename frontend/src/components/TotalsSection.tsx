import type { TotalsResponse } from "../types/Totals";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface TotalsSectionProps {
  totals: TotalsResponse | null;
  loading: boolean;
  error: string | null;
}

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function TotalsSection({ totals, loading, error }: TotalsSectionProps) {
  return (
    <Card className="border border-slate-200/80 bg-white/80 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
      <CardHeader className="border-b border-slate-200/70 pb-5">
        <CardTitle className="text-lg">Totals by person</CardTitle>
        <p className="text-sm text-slate-500">
          A quick overview of income, expenses, and balance for each person.
        </p>
      </CardHeader>
      <CardContent className="pt-5">
        {loading && (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Loading totals…
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </p>
        )}

        {!loading && !error && totals && totals.people.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-sm text-slate-500">
            No totals to show yet — add a person and a transaction first.
          </div>
        )}

        {!loading && totals && totals.people.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-4 py-3">Person</TableHead>
                  <TableHead className="px-4 py-3 text-right">Income</TableHead>
                  <TableHead className="px-4 py-3 text-right">
                    Expenses
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right">
                    Balance
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {totals.people.map((p) => (
                  <TableRow key={p.personId} className="hover:bg-slate-50/70">
                    <TableCell className="px-4 py-3 font-medium text-slate-900">
                      {p.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-emerald-600">
                      {currency.format(p.totalIncome)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-rose-600">
                      {currency.format(p.totalExpenses)}
                    </TableCell>
                    <TableCell
                      className={
                        "px-4 py-3 text-right font-semibold " +
                        (p.balance >= 0 ? "text-emerald-700" : "text-rose-700")
                      }
                    >
                      {currency.format(p.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-slate-50/80">
                <TableRow>
                  <TableCell className="px-4 py-3 font-semibold">
                    Overall
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right font-semibold text-emerald-700">
                    {currency.format(totals.overallIncome)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right font-semibold text-rose-700">
                    {currency.format(totals.overallExpenses)}
                  </TableCell>
                  <TableCell
                    className={
                      "px-4 py-3 text-right font-bold " +
                      (totals.overallBalance >= 0
                        ? "text-emerald-700"
                        : "text-rose-700")
                    }
                  >
                    {currency.format(totals.overallBalance)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
