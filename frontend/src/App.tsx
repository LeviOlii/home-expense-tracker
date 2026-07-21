import { useMemo, useState } from "react";
import { ArrowLeftRight, PiggyBank, Sparkles, Users } from "lucide-react";
import { usePeople } from "./hooks/usePeople";
import { useTransactions } from "./hooks/useTransactions";
import { useTotals } from "./hooks/useTotals";
import { PersonSection } from "./components/PersonSection";
import { TransactionSection } from "./components/TransactionSection";
import { TotalsSection } from "./components/TotalsSection";
import { cn } from "./lib/utils";
import type { CreatePersonRequest } from "./types/Person";
import type { CreateTransactionRequest } from "./types/Transaction";

type Tab = "people" | "transactions" | "totals";

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "people", label: "People", icon: Users },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "totals", label: "Totals", icon: PiggyBank },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("people");

  const people = usePeople();
  const transactions = useTransactions();
  const totals = useTotals();

  const overallBalance = useMemo(() => {
    if (!totals.totals) return 0;
    return totals.totals.overallBalance;
  }, [totals.totals]);

  async function handleAddPerson(data: CreatePersonRequest) {
    await people.addPerson(data);
    await totals.refetch();
  }

  async function handleRemovePerson(id: string) {
    await people.removePerson(id);
    await Promise.all([transactions.refetch(), totals.refetch()]);
  }

  async function handleAddTransaction(data: CreateTransactionRequest) {
    await transactions.addTransaction(data);
    await totals.refetch();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_55%)] text-slate-900">
      <header className="border-b border-white/10 bg-slate-950 text-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-10">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-200 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Household finance dashboard
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Home Expense Tracker
            </h1>
            <p className="mt-3 text-sm text-slate-300 sm:text-base">
              Track who spent what, keep an eye on balances, and make sharing
              household expenses feel effortless.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm shadow-lg backdrop-blur">
            <p className="text-slate-300">Current balance</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {currency.format(overallBalance)}
            </p>
          </div>
        </div>
      </header>

      <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-2 px-4 py-3 sm:px-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                activeTab === id
                  ? "border-violet-200 bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                  : "border-transparent bg-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        {activeTab === "people" && (
          <PersonSection
            people={people.people}
            loading={people.loading}
            error={people.error}
            onCreate={handleAddPerson}
            onDelete={handleRemovePerson}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionSection
            data={transactions.data}
            loading={transactions.loading}
            error={transactions.error}
            filters={transactions.filters}
            people={people.people}
            onCreate={handleAddTransaction}
            onGoToPage={transactions.goToPage}
            onUpdateFilters={transactions.updateFilters}
          />
        )}

        {activeTab === "totals" && (
          <TotalsSection
            totals={totals.totals}
            loading={totals.loading}
            error={totals.error}
          />
        )}
      </main>
    </div>
  );
}

export default App;
