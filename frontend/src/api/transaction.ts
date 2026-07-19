import axios from 'axios';
import type { Transaction, CreateTransactionRequest, ListTransactionsParams } from '../types/Transaction';
import type { PaginatedResponse } from '../types/Pagination';
import { API_BASE_URL } from './client';

export function listTransactions(params: ListTransactionsParams = {}): Promise<PaginatedResponse<Transaction>> {
  return axios.get<PaginatedResponse<Transaction>>(`${API_BASE_URL}/transactions`, { params })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching transactions: ', error);
      throw error;
    });
}

export function createTransaction(transactionRequestBody: CreateTransactionRequest): Promise<Transaction> {
  return axios.post<Transaction>(`${API_BASE_URL}/transactions`, transactionRequestBody)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error creating transaction: ', error);
      throw error;
    });
}