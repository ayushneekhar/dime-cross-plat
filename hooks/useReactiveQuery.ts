import { useCallback, useState } from 'react';
import { Category } from './types';
import { dbService } from './db-service';
import { useFocusEffect } from 'expo-router';
import { MMKVConstants } from '@/constants/MMKVConstants';
import { storage } from './MMKV';

export function useGetAllCategories() {
  const userId = storage.getString(MMKVConstants.USER_ID);
  const [categories, setCategories] = useState<Category[]>(
    dbService.getCategoriesByUser(userId),
  );

  useFocusEffect(
    useCallback(() => {
      const subscription = dbService.getCategoriesByUserReactively(
        userId,
        setCategories,
      );

      return subscription;
    }, [userId]),
  );

  return categories;
}

export function useGetAllTransactions() {
  const [transactions, setTransactions] = useState<Category[]>(
    dbService.getAllTransactions(),
  );

  useFocusEffect(
    useCallback(() => {
      const subscription =
        dbService.getAllTransactionsReactively(setTransactions);

      return subscription;
    }, []),
  );

  return transactions;
}
