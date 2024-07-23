import {
  IOS_LIBRARY_PATH,
  ANDROID_DATABASE_PATH,
  open,
  DB,
} from '@op-engineering/op-sqlite';
import { uuidv4 } from './utils';
import { Platform } from 'react-native';
import { Category, Transaction } from './types';
import { storage } from './MMKV';
import { MMKVConstants } from '@/constants/MMKVConstants';

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
    const { name, icon, color } = category;
    const id = uuidv4();
    const now = Date.now();
    const query = `
      INSERT INTO categories (id, user_id, name, icon, color, created_at, updated_at, is_synced)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return this.database?.execute(query, [
      id,
      user_id,
      name,
      icon,
      color,
      now,
      now,
      0,
    ]).insertId;
  }

  getCategoriesByUser(userId: string): Category[] {
    const query = 'SELECT * FROM categories WHERE user_id = ?';

    return this.database?.execute(query, [userId]).res || [];
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

  // Get all transactions
  getAllTransactions(): Transaction[] {
    const query = 'SELECT * FROM transactions';
    return this.database?.execute(query).res || [];
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
