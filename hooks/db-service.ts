import {
  IOS_LIBRARY_PATH,
  ANDROID_DATABASE_PATH,
  open,
  DB,
} from '@op-engineering/op-sqlite';
import { uuidv4 } from './utils';
import { Platform } from 'react-native';
import { Category, GroupedTransactions, Transaction } from './types';
import { storage } from './MMKV';
import { MMKVConstants } from '@/constants/MMKVConstants';
import dayjs from 'dayjs';

class DbService {
  private database: DB;

  // Initialize the database
  initDB() {
    this.database = open({
      name: 'TransactionsDB',
      location:
        Platform.OS === 'ios' ? IOS_LIBRARY_PATH : ANDROID_DATABASE_PATH,
    });
    return this.createTable();
  }

  // Create the tables if they doesn't exist
  private createTable() {
    const categoriesQuery = `
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        is_synced INTEGER DEFAULT 0
      )
    `;

    const transactionsQuery = `
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        category_id TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        date INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `;

    try {
      console.log(
        'Table categories successfully',
        this.database.execute(categoriesQuery),
      );
      console.log(
        'Table transactions successfully',
        this.database.execute(transactionsQuery),
      );
    } catch (error) {
      console.log('Table creation failed', error);
    }
  }

  addCategory(
    category: Omit<
      Category,
      'id' | 'created_at' | 'updated_at' | 'is_synced' | 'user_id'
    >,
  ) {
    const user_id = storage.getString(MMKVConstants.USER_ID);
    const { name, icon, color, type } = category;
    const id = uuidv4();
    const now = Date.now();
    const query = `
      INSERT INTO categories (id, user_id, name, icon, color, type, created_at, updated_at, is_synced)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return this.database?.execute(query, [
      id,
      user_id,
      name,
      icon,
      color,
      type,
      now,
      now,
      0,
    ]).insertId;
  }

  getCategoriesByTypeReactively(
    type: 'expense' | 'income',
    setter: () => void,
  ) {
    const userId = storage.getString(MMKVConstants.USER_ID);
    const query = `SELECT * FROM categories WHERE user_id = ? AND type = ?`;

    return this.database.reactiveExecute({
      query,
      arguments: [userId, type],
      fireOn: [
        {
          table: 'categories',
        },
      ],
      callback: response => {
        setter(response.rows._array);
      },
    });
  }

  getCategoriesByType(type: 'expense' | 'income'): Category[] {
    const userId = storage.getString(MMKVConstants.USER_ID);
    const query = 'SELECT * FROM categories WHERE user_id = ? AND type = ?';

    return this.database.execute(query, [userId, type]).res;
  }

  // Add a new transaction
  addTransaction(
    transaction: Omit<
      Transaction,
      'id' | 'created_at' | 'updated_at' | 'is_synced' | 'user_id'
    >,
  ): string {
    const user_id = storage.getString(MMKVConstants.USER_ID);
    const { category_id, amount, description, date } = transaction;
    const id = uuidv4();
    const now = Date.now();
    const query = `
      INSERT INTO transactions (id, user_id, category_id, amount, description, date, created_at, updated_at, is_synced)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    console.log(
      'Inserted Transaction',
      JSON.stringify(
        {
          id,
          user_id,
          category_id,
          amount,
          description,
          date,
          created_at: now,
          updated_at: now,
          is_synced: 0,
        },
        null,
        2,
      ),
    );

    return this.database?.execute(query, [
      id,
      user_id,
      category_id,
      amount,
      description,
      date,
      now,
      now,
      0,
    ]).insertId;
  }

  private groupTransactionsByDay(
    rawTransactions: Transaction[],
  ): GroupedTransactions[] {
    const grouped =
      rawTransactions?.reduce((acc, transaction) => {
        const date = dayjs.unix(transaction.date).format('YYYY-MM-DD');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
      }, {}) || {};

    // Convert to array and sort by date
    return Object.entries(grouped)
      .map(([date, transactions]) => {
        let date_total = 0;
        transactions.forEach(transaction => {
          date_total += transaction.amount;
        });
        return { date, data: transactions, total: date_total };
      })
      .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
  }

  getAllTransactions(): Transaction[] {
    const query = `SELECT 
                      t.*, 
                      c.name AS category_name, 
                      c.color AS category_color,
                      c.icon AS category_icon
                  FROM 
                      transactions t
                  LEFT JOIN 
                      categories c ON t.category_id = c.id
                  ORDER BY 
                      t.date DESC;`;

    return this.groupTransactionsByDay(this.database.execute(query).res);
  }

  getAllTransactionsReactively(setter) {
    const query = `SELECT 
                      t.*, 
                      c.name AS category_name, 
                      c.color AS category_color,
                      c.icon AS category_icon
                  FROM 
                      transactions t
                  LEFT JOIN 
                      categories c ON t.category_id = c.id
                  ORDER BY 
                      t.date DESC;`;

    return this.database.reactiveExecute({
      query,
      fireOn: [
        {
          table: 'transactions',
        },
        {
          table: 'categories',
        },
      ],
      callback: response => {
        setter(this.groupTransactionsByDay(response.rows._array));
      },
    });
  }

  dropTables() {
    const dropTransactions = 'DROP TABLE IF EXISTS transactions;';
    const dropCategories = 'DROP TABLE IF EXISTS categories;';

    if (this.database) {
      try {
        console.log(
          'Dropping transactions table:',
          this.database.execute(dropTransactions),
        );
        console.log(
          'Dropping categories table:',
          this.database.execute(dropCategories),
        );
      } catch (error) {
        console.error('Error dropping tables:', error);
      }
    } else {
      console.error('Database is not initialized');
    }
  }

  // Update a transaction
  updateTransaction(transaction: Transaction): boolean {
    const { id, amount, description, date, type } = transaction;
    const query = `
      UPDATE transactions
      SET amount = ?, description = ?, date = ?, type = ?
      WHERE id = ?
    `;
    return !!this.database?.execute(query, [
      amount,
      description,
      date,
      type,
      id,
    ]).insertId;
  }

  //Delete Category
  deleteCategory(id: number): boolean {
    const query = 'DELETE FROM categories WHERE id = ?';
    return this.database?.execute(query, [id]);
  }

  // Delete a transaction
  deleteTransaction(id: number): boolean {
    const query = 'DELETE FROM transactions WHERE id = ?';
    return this.database?.execute(query, [id]);
  }

  // Close the database connection
  closeDatabase() {
    return this.database.close();
  }
}

export const dbService = new DbService();
