"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Filter, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { fetchTransactions, type Transaction } from "@/lib/expense-transactions";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getStoredSettings, formatCurrency as formatCurrencySetting } from "@/lib/settings";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#ff7300",
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "m1",
    amount: 15000000,
    category: "Lương",
    date: "2024-02-01",
    type: "income",
    note: null,
  },
  {
    id: "m2",
    amount: 50000,
    category: "Ăn uống",
    date: "2024-02-02",
    type: "expense",
    note: null,
  },
  {
    id: "m3",
    amount: 200000,
    category: "Di chuyển",
    date: "2024-02-03",
    type: "expense",
    note: null,
  },
  {
    id: "m4",
    amount: 5000000,
    category: "Thưởng",
    date: "2024-02-05",
    type: "income",
    note: null,
  },
  {
    id: "m5",
    amount: 3000000,
    category: "Nhà ở",
    date: "2024-02-10",
    type: "expense",
    note: null,
  },
  {
    id: "m6",
    amount: 1500000,
    category: "Mua sắm",
    date: "2024-02-14",
    type: "expense",
    note: null,
  },
  {
    id: "m7",
    amount: 200000,
    category: "Ăn uống",
    date: "2024-02-15",
    type: "expense",
    note: null,
  },
  {
    id: "m8",
    amount: 1000000,
    category: "Giải trí",
    date: "2024-02-20",
    type: "expense",
    note: null,
  },
  {
    id: "m9",
    amount: 500000,
    category: "Hóa đơn",
    date: "2024-02-25",
    type: "expense",
    note: null,
  },
  {
    id: "m10",
    amount: 15000000,
    category: "Lương",
    date: "2024-01-01",
    type: "income",
    note: null,
  },
  {
    id: "m11",
    amount: 2000000,
    category: "Mua sắm",
    date: "2024-01-10",
    type: "expense",
    note: null,
  },
];

function getDefaultMonth() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export default function ReportPage() {
  const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const useDb = isSupabaseConfigured();

  useEffect(() => {
    if (useDb) {
      setLoading(true);
      fetchTransactions()
        .then(setTransactions)
        .finally(() => setLoading(false));
    } else {
      setTransactions(MOCK_TRANSACTIONS);
      setLoading(false);
    }
  }, [useDb]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const barChartData = useMemo(() => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    const data = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = `${selectedMonth}-${String(i).padStart(2, "0")}`;
      const dayTrans = filteredTransactions.filter((t) => t.date === dayStr);
      data.push({
        day: i,
        Thu: dayTrans
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0),
        Chi: dayTrans
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0),
      });
    }
    return data;
  }, [selectedMonth, filteredTransactions]);

  const pieChartData = useMemo(() => {
    const expenseMap: Record<string, number> = {};
    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
      });
    return Object.keys(expenseMap).map((key) => ({
      name: key,
      value: expenseMap[key],
    }));
  }, [filteredTransactions]);

  const settings =
    typeof window !== "undefined" ? getStoredSettings() : null;
  const currency = settings?.currency ?? "VND";
  const formatCurrency = (val: number) =>
    formatCurrencySetting(val, currency);

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 px-3 py-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Filter className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
            Báo Cáo Thống Kê
          </h1>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">Đang tải dữ liệu...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              <StatCard
                title="Tổng Thu Nhập"
                amount={stats.income}
                icon={<TrendingUp className="text-green-600" />}
                bg="bg-green-50"
                textColor="text-green-600"
                formatCurrency={formatCurrency}
              />
              <StatCard
                title="Tổng Chi Tiêu"
                amount={stats.expense}
                icon={<TrendingDown className="text-red-600" />}
                bg="bg-red-50"
                textColor="text-red-600"
                formatCurrency={formatCurrency}
              />
              <StatCard
                title="Số Dư Tháng Này"
                amount={stats.balance}
                icon={<Wallet className="text-indigo-600" />}
                bg="bg-indigo-50"
                textColor={
                  stats.balance >= 0 ? "text-indigo-600" : "text-red-600"
                }
                formatCurrency={formatCurrency}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">
                  Biến động Thu/Chi trong tháng
                </h3>
                <div className="h-64 sm:h-80 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tickFormatter={(value) => `${value / 1000}k`}
                        tickLine={false}
                        axisLine={false}
                        className="text-xs"
                      />
                      <Tooltip
                        formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow:
                            "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="Thu"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                      <Bar
                        dataKey="Chi"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">
                  Cơ cấu Chi Tiêu
                </h3>
                <div className="h-64 sm:h-80 w-full min-w-0 flex items-center justify-center">
                  {pieChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number | undefined) =>
                            formatCurrency(value ?? 0)
                          }
                        />
                        <Legend
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-400">
                      Chưa có dữ liệu chi tiêu tháng này
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  amount,
  icon,
  bg,
  textColor,
  formatCurrency,
}: {
  title: string;
  amount: number;
  icon: React.ReactNode;
  bg: string;
  textColor: string;
  formatCurrency: (val: number) => string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{title}</p>
        <p className={`text-lg sm:text-2xl font-bold truncate ${textColor}`}>
          {formatCurrency(amount)}
        </p>
      </div>
      <div className={`p-2 sm:p-3 rounded-full shrink-0 ${bg}`}>{icon}</div>
    </div>
  );
}
