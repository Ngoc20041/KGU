import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

export type TransactionType = "income" | "expense";

export interface TransactionDto {
  id: string;
  amount: number;
  category: string;
  note: string | null;
  date: string;
  type: TransactionType;
  created_at: string | null;
}

type Row = Database["public"]["Tables"]["expense_transaction"]["Row"];
type Insert = Database["public"]["Tables"]["expense_transaction"]["Insert"];

export const TRANSACTION_ERROR_NOT_CONFIGURED =
  "Supabase chưa được cấu hình";
const NOT_CONFIGURED = TRANSACTION_ERROR_NOT_CONFIGURED;

function rowToDto(row: Row): TransactionDto {
  return {
    id: row.id,
    amount: Number(row.amount),
    category: row.category,
    note: row.note,
    date: row.date,
    type: row.type as TransactionType,
    created_at: row.created_at,
  };
}

/**
 * Lấy toàn bộ giao dịch, sắp xếp theo ngày và created_at giảm dần.
 */
export async function getTransactions(): Promise<TransactionDto[]> {
  if (!supabase) throw new Error(NOT_CONFIGURED);

  const { data, error } = await supabase
    .from("expense_transaction")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToDto);
}

/**
 * Thêm một giao dịch mới.
 */
export async function createTransaction(
  payload: Omit<Insert, "id" | "created_at">
): Promise<TransactionDto> {
  if (!supabase) throw new Error(NOT_CONFIGURED);

  const { data, error } = await supabase
    .from("expense_transaction")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToDto(data);
}

/**
 * Xóa giao dịch theo id.
 */
export async function deleteTransactionById(id: string): Promise<void> {
  if (!supabase) throw new Error(NOT_CONFIGURED);

  const { error } = await supabase
    .from("expense_transaction")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
