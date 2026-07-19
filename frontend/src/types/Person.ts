
export interface Person {
    id: string;
    name: string;
    age: number;
}

export type CreatePersonRequest = Omit<Person, 'id'>;
