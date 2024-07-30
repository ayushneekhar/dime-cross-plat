export type Category = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  created_at: number;
  updated_at: number;
  is_synced: number;
  type: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description?: string;
  date: number;
  created_at: number;
  updated_at: number;
  is_synced: number;
};

export type GroupedTransactions = {
  date: string;
  data: Transaction[];
  total: number;
};
