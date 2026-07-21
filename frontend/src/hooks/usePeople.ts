import { useCallback, useEffect, useState } from "react";
import type { Person, CreatePersonRequest } from "../types/Person";
import { listPeople, createPerson, deletePerson } from "../api/people";

export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPeople();
      setPeople(data);
    } catch {
      setError("Could not load people.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  async function addPerson(data: CreatePersonRequest): Promise<Person> {
    const created = await createPerson(data);
    setPeople((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  }

  async function removePerson(id: string): Promise<void> {
    await deletePerson(id);
    setPeople((prev) => prev.filter((person) => person.id !== id));
  }

  return { people, loading, error, refetch, addPerson, removePerson };
}
