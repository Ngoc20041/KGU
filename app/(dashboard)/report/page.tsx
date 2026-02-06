"use client";

import React, { useState, useMemo } from 'react';
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
  Cell 
} from 'recharts';
import { Calendar, Filter, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

// --- 1. Dữ liệu giả lập (Mô phỏng database) ---
const MOCK_TRANSACTIONS = [
  { id: 1, amount: 15000000, category: 'Lương', date: '2024-02-01', type: 'income' },
  { id: 2, amount: 50000, category: 'Ăn uống', date: '2024-02-02', type: 'expense' },
  { id: 3, amount: 200000, category: 'Di chuyển', date: '2024-02-03', type: 'expense' },
  { id: 4, amount: 5000000, category: 'Thưởng', date: '2024-02-05', type: 'income' },
  { id: 5, amount: 3000000, category: 'Nhà ở', date: '2024-02-10', type: 'expense' },
  { id: 6, amount: 1500000, category: 'Mua sắm', date: '2024-02-14', type: 'expense' },
  { id: 7, amount: 200000, category: 'Ăn uống', date: '2024-02-15', type: 'expense' },
  { id: 8, amount: 1000000, category: 'Giải trí', date: '2024-02-20', type: 'expense' },
  { id: 9, amount: 500000, category: 'Hóa đơn', date: '2024-02-25', type: 'expense' },
  // Dữ liệu tháng khác để test bộ lọc
  { id: 10, amount: 15000000, category: 'Lương', date: '2024-01-01', type: 'income' },
  { id: 11, amount: 2000000, category: 'Mua sắm', date: '2024-01-10', type: 'expense' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff7300'];

export default function ReportPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-02'); // Mặc định tháng 2/2024

  // --- 2. Xử lý dữ liệu ---

  // Lọc giao dịch theo tháng được chọn
  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => t.date.startsWith(selectedMonth));
  }, [selectedMonth]);

  // Tính tổng quan
  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  // Chuẩn bị dữ liệu cho Biểu đồ Cột (Theo ngày trong tháng)
  const barChartData = useMemo(() => {
    const daysInMonth = new Date(
      parseInt(selectedMonth.split('-')[0]),
      parseInt(selectedMonth.split('-')[1]), 
      0
    ).getDate();

    const data = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = `${selectedMonth}-${i.toString().padStart(2, '0')}`;
      const dayTrans = filteredTransactions.filter(t => t.date === dayStr);
      
      data.push({
        day: i, // Ngày 1, 2, 3...
        Thu: dayTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        Chi: dayTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      });
    }
    return data;
  }, [selectedMonth, filteredTransactions]);

  // Chuẩn bị dữ liệu cho Biểu đồ Tròn (Phân loại chi tiêu)
  const pieChartData = useMemo(() => {
    const expenseMap: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
      });
    
    return Object.keys(expenseMap).map(key => ({
      name: key,
      value: expenseMap[key]
    }));
  }, [filteredTransactions]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Filter className="w-6 h-6 text-indigo-600" />
            Báo Cáo Thống Kê
          </h1>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Tổng quan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Tổng Thu Nhập" 
            amount={stats.income} 
            icon={<TrendingUp className="text-green-600" />} 
            bg="bg-green-50" 
            textColor="text-green-600"
          />
          <StatCard 
            title="Tổng Chi Tiêu" 
            amount={stats.expense} 
            icon={<TrendingDown className="text-red-600" />} 
            bg="bg-red-50" 
            textColor="text-red-600"
          />
          <StatCard 
            title="Số Dư Tháng Này" 
            amount={stats.balance} 
            icon={<Wallet className="text-indigo-600" />} 
            bg="bg-indigo-50" 
            textColor={stats.balance >= 0 ? 'text-indigo-600' : 'text-red-600'}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Biểu đồ 1: Thu vs Chi theo ngày */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Biến động Thu/Chi trong tháng</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis 
                    tickFormatter={(value) => `${value / 1000}k`} 
                    tickLine={false} 
                    axisLine={false}
                    className="text-xs"
                  />
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="Thu" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="Chi" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biểu đồ 2: Phân loại chi tiêu */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Cơ cấu Chi Tiêu</h3>
            <div className="h-80 w-full flex items-center justify-center">
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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400">Chưa có dữ liệu chi tiêu tháng này</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-component cho thẻ thống kê nhỏ gọn
function StatCard({ title, amount, icon, bg, textColor }: { title: string, amount: number, icon: React.ReactNode, bg: string, textColor: string }) {
  const format = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <p className={`text-2xl font-bold ${textColor}`}>{format(amount)}</p>
      </div>
      <div className={`p-3 rounded-full ${bg}`}>
        {icon}
      </div>
    </div>
  );
}