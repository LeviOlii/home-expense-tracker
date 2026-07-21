import { useState, type FormEvent } from "react";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import type { Person, CreatePersonRequest } from "../types/Person";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface PersonSectionProps {
  people: Person[];
  loading: boolean;
  error: string | null;
  onCreate: (data: CreatePersonRequest) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
}

export function PersonSection({
  people,
  loading,
  error,
  onCreate,
  onDelete,
}: PersonSectionProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    const parsedAge = Number(age);
    if (!name.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (age === "" || Number.isNaN(parsedAge) || parsedAge < 0) {
      setFormError("Enter a valid age.");
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({ name: name.trim(), age: parsedAge });
      setName("");
      setAge("");
    } catch {
      setFormError("Could not add this person. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, personName: string) {
    const confirmed = window.confirm(
      `Delete ${personName}? This also deletes all of their transactions.`,
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card className="border border-slate-200/80 bg-white/80 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-100 p-2 text-violet-700">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Add person</CardTitle>
              <p className="text-sm text-slate-500">
                Add each household member and keep your records organized.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="person-name">Name</Label>
              <Input
                id="person-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ana Souza"
                className="h-10 rounded-xl border-slate-200 bg-slate-50/80"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="person-age">Age</Label>
              <Input
                id="person-age"
                type="number"
                min={0}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 32"
                className="h-10 rounded-xl border-slate-200 bg-slate-50/80"
              />
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
                <UserPlus className="h-4 w-4" />
              )}
              Add person
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-slate-200/80 bg-white/80 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">
                People ({people.length})
              </CardTitle>
              <p className="text-sm text-slate-500">
                A clear view of everyone in the household.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {people.length > 0
                ? `${people.length} members`
                : "No members yet"}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Loading people…
            </p>
          )}
          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          )}

          {!loading && !error && people.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-sm text-slate-500">
              No one has been added yet. Use the form to add the first person.
            </div>
          )}

          <ul className="space-y-2">
            {people.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 transition hover:border-violet-200 hover:bg-white"
              >
                <div>
                  <p className="font-medium text-slate-900">{person.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {person.age} years old
                    {person.age < 18 && (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Expenses only
                      </span>
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(person.id, person.name)}
                  disabled={deletingId === person.id}
                  aria-label={`Delete ${person.name}`}
                >
                  {deletingId === person.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-rose-600" />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
