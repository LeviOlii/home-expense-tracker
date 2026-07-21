export interface PersonTotal {
    personId: string;
    name: string;
    totalIncome: number;
    totalExpenses: number;
    balance: number;
}

export interface TotalsResponse {
    people: PersonTotal[];
    overallIncome: number;
    overallExpenses: number;
    overallBalance: number;
}