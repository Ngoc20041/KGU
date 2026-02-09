"use client";

import type { Database } from "./database.types";

export type TransactionType = "income" | "expense";

export type ExpenseTransactionRow =
  Database["public"]["Tables"]["expense_transaction"]["Row"];

export type ExpenseTransactionInsert =
  Database["public"]["Tables"]["expense_transaction"]["Insert"];

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  note: string | null;
  date: string;
  type: TransactionType;
  created_at?: string | null;
}

const API_BASE = "/api/transactions";

/** Gọi API lấy danh sách giao dịch */
export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch(API_BASE, { cache: "no-store" });
  if (res.status === 503) return [];
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Lỗi ${res.status}`);
  }
  return res.json();
}

/** Gọi API thêm giao dịch */
export async function addTransaction(
  payload: Omit<ExpenseTransactionInsert, "id" | "created_at">
): Promise<Transaction> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 503) {
    throw new Error("Supabase chưa được cấu hình");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Lỗi ${res.status}`);
  }
  return res.json();
}

/** Gọi API xóa giao dịch */
export async function deleteTransaction(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (res.status === 503) {
    throw new Error("Supabase chưa được cấu hình");
  }
  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Lỗi ${res.status}`);
  }
}
