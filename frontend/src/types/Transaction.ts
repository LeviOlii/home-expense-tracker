export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
    id: string;
    description?: string;
    amount: number;
    type: TransactionType;
    personId: string;
}

export type CreateTransactionRequest = Omit<Transaction, 'id'>;

export interface ListTransactionsParams {
  page?: number;
  pageSize?: number;
  personId?: string;
  type?: TransactionType;
}