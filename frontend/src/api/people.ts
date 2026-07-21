import axios from 'axios';
import type { Person, CreatePersonRequest } from '@/types/Person';
import { API_BASE_URL } from './client';
import type { TotalsResponse } from '@/types/Totals';

export function listPeople(): Promise<Person[]> {
  return axios.get<Person[]>(`${API_BASE_URL}/people`)
    .then((people) => people.data)
    .catch((error) => {
      console.error('Error fetching people: ', error);
      throw error;
    });
}

export function createPerson(person: CreatePersonRequest): Promise<Person> {
    return axios.post<Person>(`${API_BASE_URL}/people`, person)
        .then((response) => response.data)
        .catch((error) => {
            console.error('Error creating person: ', error);
            throw error;
        });
}

export function deletePerson(personId: string): Promise<void> {
    return axios.delete<void>(`${API_BASE_URL}/people/${personId}`)
        .then(() => {
            console.log(`Person with ID ${personId} deleted successfully.`);
        })
        .catch((error) => {
            console.error(`Error deleting person with ID ${personId}: `, error);
            throw error;
        });
}

export function getTotals(): Promise<TotalsResponse> {
  return axios
    .get<TotalsResponse>(`${API_BASE_URL}/people/totals`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching totals: ", error);
      throw error;
    });
}