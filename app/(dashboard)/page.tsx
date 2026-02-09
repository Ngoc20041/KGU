"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  AlertCircle,
} from "lucide-react";
import {
  fetchTransactions,
  addTransaction,
  deleteTransaction,
  type Transaction,
  type TransactionType,
} from "@/lib/expense-transactions";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getStoredSettings, formatCurrency as formatCurrencySetting } from "@/lib/settings";

const CATEGORIES = {
  expense: [
    "Ăn uống",
    "Di chuyển",
    "Nhà ở",
    "Mua sắm",
    "Giải trí",
    "Hóa đơn",
    "Khác",
  ],
  income: ["Lương", "Thưởng", "Đầu tư", "Bán đồ cũ", "Khác"],
};

const INITIAL_DATA: Transaction[] = [
  {
    id: "local-1",
    amount: 5000000,
    category: "Lương",
    note: "Lương tháng 1",
    date: "2024-02-01",
    type: "income",
  },
  {
    id: "local-2",
    amount: 50000,
    category: "Ăn uống",
    note: "Phở bò",
    date: "2024-02-02",
    type: "expense",
  },
  {
    id: "local-3",
    amount: 300000,
    category: "Di chuyển",
    note: "Đổ xăng",
    date: "2024-02-03",
    type: "expense",
  },
];

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    category: CATEGORIES.expense[0],
    note: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense" as TransactionType,
  });
  const [submitting, setSubmitting] = useState(false);

  const useDb = isSupabaseConfigured();

  useEffect(() => {
    if (useDb) {
      setLoading(true);
      setError(null);
      fetchTransactions()
        .then(setTransactions)
        .catch((e) => setError(e?.message ?? "Lỗi tải dữ liệu"))
        .finally(() => setLoading(false));
    } else {
      setTransactions(INITIAL_DATA);
      setLoading(false);
    }
  }, [useDb]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type"
        ? { category: CATEGORIES[value as TransactionType][0] }
        : {}),
    }));
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    const amount = parseFloat(formData.amount);
    if (amount <= 0) return;

    if (useDb) {
      setSubmitting(true);
      setError(null);
      try {
        const newRow = await addTransaction({
          amount,
          category: formData.category,
          note: formData.note || null,
          date: formData.date,
          type: formData.type,
        });
        setTransactions((prev) => [newRow, ...prev]);
        setFormData((prev) => ({ ...prev, amount: "", note: "" }));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Không thể thêm giao dịch"
        );
      } finally {
        setSubmitting(false);
      }
    } else {
      const newTransaction: Transaction = {
        id: `local-${Date.now()}`,
        amount,
        category: formData.category,
        note: formData.note || null,
        date: formData.date,
        type: formData.type,
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      setFormData((prev) => ({ ...prev, amount: "", note: "" }));
    }
  };

  const handleDelete = async (id: string) => {
    if (useDb) {
      setError(null);
      try {
        await deleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Không thể xóa giao dịch"
        );
      }
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const expensesByCategory = useMemo(() => {
    const groups: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        groups[t.category] = (groups[t.category] || 0) + t.amount;
      });
    return Object.entries(groups).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const settings = typeof window !== "undefined" ? getStoredSettings() : null;
  const currency = settings?.currency ?? "VND";
  const formatCurrency = (amount: number) =>
    formatCurrencySetting(amount, currency);

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 px-3 py-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {!useDb && (
          <div className="flex flex-wrap items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="flex-1 min-w-0">
              Đang dùng dữ liệu mẫu. Để lưu lâu dài, cấu hình{" "}
              <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded text-xs sm:text-sm">.env.local</code> với
              Supabase và chạy migration bảng{" "}
              <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded text-xs sm:text-sm">expense_transaction</code>.
            </span>
          </div>
        )}

        {error && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="flex-1 min-w-0">{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="shrink-0 py-1 px-2 text-red-600 dark:text-red-400 hover:underline touch-manipulation"
            >
              Đóng
            </button>
          </div>
        )}

        <div className="flex justify-between items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 truncate min-w-0">
            <Wallet className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="truncate">Quản Lý Thu Chi</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Số dư hiện tại</p>
                <p
                  className={`text-lg sm:text-2xl font-bold truncate ${
                    stats.balance >= 0 ? "text-gray-900 dark:text-gray-100" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatCurrency(stats.balance)}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 shrink-0">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Tổng thu</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400 truncate">
                  +{formatCurrency(stats.income)}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sm:col-span-2 md:col-span-1">
            <div className="flex justify-between items-center gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Tổng chi</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 truncate">
                  -{formatCurrency(stats.expense)}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-50 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 shrink-0">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 shrink-0" />
                Thêm Giao Dịch
              </h2>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại giao dịch
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          type: "income",
                          category: CATEGORIES.income[0],
                        })
                      }
                      className={`py-2 px-4 rounded-lg text-sm font-medium border ${
                        formData.type === "income"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Thu nhập
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          type: "expense",
                          category: CATEGORIES.expense[0],
                        })
                      }
                      className={`py-2 px-4 rounded-lg text-sm font-medium border ${
                        formData.type === "expense"
                          ? "bg-red-50 border-red-200 text-red-700"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Chi tiêu
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tiền ({currency})
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phân loại
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                  >
                    {CATEGORIES[formData.type].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Ăn trưa"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {submitting ? "Đang lưu..." : "Lưu giao dịch"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 shrink-0" />
                Phân Loại Chi Tiêu
              </h2>
              {loading ? (
                <p className="text-gray-500 text-center py-4">Đang tải...</p>
              ) : expensesByCategory.length > 0 ? (
                <div className="space-y-4">
                  {expensesByCategory.map(([category, amount]) => {
                    const percent = Math.round(
                      (amount / stats.expense) * 100
                    );
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">
                            {category}
                          </span>
                          <span className="text-gray-500">
                            {formatCurrency(amount)} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-indigo-600 h-2.5 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Chưa có dữ liệu chi tiêu
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Lịch sử giao dịch
                </h2>
              </div>
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full text-sm text-left min-w-[500px]">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-medium">
                    <tr>
                      <th className="py-2 sm:py-3 px-3 sm:px-6">Ngày</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-6">Danh mục</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-6 hidden sm:table-cell">Ghi chú</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-6 text-right">Số tiền</th>
                      <th className="py-2 sm:py-3 px-3 sm:px-6 text-center w-12">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-6 sm:py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                          Đang tải...
                        </td>
                      </tr>
                    ) : (
                      transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <td className="py-2 sm:py-3 px-3 sm:px-6 text-gray-600 dark:text-gray-400 text-xs sm:text-sm whitespace-nowrap">{t.date}</td>
                          <td className="py-2 sm:py-3 px-3 sm:px-6 font-medium">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                t.type === "income"
                                  ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300"
                                  : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300"
                              }`}
                            >
                              {t.category}
                            </span>
                          </td>
                          <td className="py-2 sm:py-3 px-3 sm:px-6 text-gray-600 dark:text-gray-400 hidden sm:table-cell max-w-[120px] truncate" title={t.note ?? undefined}>
                            {t.note ?? "—"}
                          </td>
                          <td
                            className={`py-2 sm:py-3 px-3 sm:px-6 text-right font-bold text-xs sm:text-sm whitespace-nowrap ${
                              t.type === "income"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {t.type === "income" ? "+" : "-"}
                            {formatCurrency(t.amount)}
                          </td>
                          <td className="py-2 sm:py-3 px-3 sm:px-6 text-center">
                            <button
                              type="button"
                              onClick={() => handleDelete(t.id)}
                              className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center mx-auto text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors touch-manipulation"
                              aria-label="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                    {!loading && transactions.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-6 sm:py-8 text-center text-gray-400 dark:text-gray-500 text-sm"
                        >
                          Chưa có giao dịch nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
