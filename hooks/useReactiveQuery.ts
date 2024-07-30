import { useEffect, useState } from 'react';
import { Category, Transaction } from './types';
import { dbService } from './db-service';

export function useGetAllCategories({
  type = 'expense',
}: {
  type: 'income' | 'expense';
} = {}) {
  const [categories, setCategories] = useState<Category[]>(
    dbService.getCategoriesByType(type),
  );

  useEffect(() => {
    const subscription = dbService.getCategoriesByTypeReactively(
      type,
      setCategories,
    );
    setCategories(dbService.getCategoriesByType(type));

    return subscription;
  }, [type]);

  return categories;
}

export function useGetAllTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(
    dbService.getAllTransactions(),
  );

  useEffect(() => {
    const subscription =
      dbService.getAllTransactionsReactively(setTransactions);

    return subscription;
  }, []);

  return transactions;
}
