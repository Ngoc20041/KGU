export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string; // Hex code for UI
  icon?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO string format
  categoryId: string;
  type: TransactionType;
}

// Dữ liệu mẫu ban đầu để phát triển UI
export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Ăn uống', type: 'EXPENSE', color: '#ef4444', icon: 'utensils' },
  { id: '2', name: 'Di chuyển', type: 'EXPENSE', color: '#f59e0b', icon: 'car' },
  { id: '3', name: 'Lương', type: 'INCOME', color: '#22c55e', icon: 'wallet' },
  { id: '4', name: 'Thưởng', type: 'INCOME', color: '#10b981', icon: 'gift' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 50000, description: 'Phở bò', date: new Date().toISOString(), categoryId: '1', type: 'EXPENSE' },
  { id: '2', amount: 20000000, description: 'Lương tháng 10', date: new Date().toISOString(), categoryId: '3', type: 'INCOME' },
];
