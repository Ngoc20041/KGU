"use client";

import React, { useState, useMemo } from 'react';
import {
    PlusCircle,
    Trash2,
    TrendingUp,
    TrendingDown,
    Wallet,
    PieChart
} from 'lucide-react';

// --- 1. Định nghĩa Types & Dữ liệu mẫu ---

type TransactionType = 'income' | 'expense';

interface Transaction {
    id: number;
    amount: number;
    category: string;
    note: string;
    date: string;
    type: TransactionType;
}

// Danh mục mẫu cho chức năng "Phân loại chi tiêu"
const CATEGORIES = {
    expense: ['Ăn uống', 'Di chuyển', 'Nhà ở', 'Mua sắm', 'Giải trí', 'Hóa đơn', 'Khác'],
    income: ['Lương', 'Thưởng', 'Đầu tư', 'Bán đồ cũ', 'Khác'],
};

const INITIAL_DATA: Transaction[] = [
    { id: 1, amount: 5000000, category: 'Lương', note: 'Lương tháng 1', date: '2024-02-01', type: 'income' },
    { id: 2, amount: 50000, category: 'Ăn uống', note: 'Phở bò', date: '2024-02-02', type: 'expense' },
    { id: 3, amount: 300000, category: 'Di chuyển', note: 'Đổ xăng', date: '2024-02-03', type: 'expense' },
];

export default function DashboardPage() {
    // --- 2. State Management ---
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_DATA);

    // State cho Form
    const [formData, setFormData] = useState({
        amount: '',
        category: CATEGORIES.expense[0],
        note: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense' as TransactionType,
    });

    // --- 3. Logic Xử lý (Actions) ---

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Nếu đổi loại (thu/chi) thì reset category về mặc định của loại đó
            ...(name === 'type' ? { category: CATEGORIES[value as TransactionType][0] } : {})
        }));
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || !formData.category) return;

        const newTransaction: Transaction = {
            id: Date.now(),
            amount: parseFloat(formData.amount),
            category: formData.category,
            note: formData.note,
            date: formData.date,
            type: formData.type,
        };

        setTransactions([newTransaction, ...transactions]);

        // Reset form (giữ lại ngày và loại để nhập tiếp cho nhanh)
        setFormData(prev => ({ ...prev, amount: '', note: '' }));
    };

    const handleDelete = (id: number) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    // --- 4. Logic Thống kê & Báo cáo (Dùng useMemo để tối ưu) ---

    const stats = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expense,
            balance: income - expense
        };
    }, [transactions]);

    // Nhóm chi tiêu theo danh mục (cho phần Báo cáo phân loại)
    const expensesByCategory = useMemo(() => {
        const groups: Record<string, number> = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                groups[t.category] = (groups[t.category] || 0) + t.amount;
            });
        return Object.entries(groups).sort((a, b) => b[1] - a[1]); // Sắp xếp giảm dần
    }, [transactions]);

    // Format tiền tệ VNĐ
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // --- 5. Giao diện (UI) ---

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Wallet className="w-8 h-8 text-indigo-600" />
                        Quản Lý Thu Chi
                    </h1>
                </div>

                {/* --- Phần 1: Thẻ Thống Kê Tổng Quan --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Số dư hiện tại</p>
                                <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                                    {formatCurrency(stats.balance)}
                                </p>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                                <Wallet className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Tổng thu</p>
                                <p className="text-2xl font-bold text-green-600">
                                    +{formatCurrency(stats.income)}
                                </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-full text-green-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Tổng chi</p>
                                <p className="text-2xl font-bold text-red-600">
                                    -{formatCurrency(stats.expense)}
                                </p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-full text-red-600">
                                <TrendingDown className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* --- Phần 2: Form Ghi Chú Thu Chi --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <PlusCircle className="w-5 h-5" />
                                Thêm Giao Dịch
                            </h2>
                            <form onSubmit={handleAddTransaction} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại giao dịch</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'income', category: CATEGORIES.income[0] })}
                                            className={`py-2 px-4 rounded-lg text-sm font-medium border ${
                                                formData.type === 'income'
                                                    ? 'bg-green-50 border-green-200 text-green-700'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            Thu nhập
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'expense', category: CATEGORIES.expense[0] })}
                                            className={`py-2 px-4 rounded-lg text-sm font-medium border ${
                                                formData.type === 'expense'
                                                    ? 'bg-red-50 border-red-200 text-red-700'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            Chi tiêu
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VNĐ)</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phân loại</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                                    >
                                        {CATEGORIES[formData.type].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
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
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Lưu giao dịch
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* --- Phần 3: Danh sách & Biểu đồ --- */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Báo cáo phân loại chi tiêu */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <PieChart className="w-5 h-5" />
                                Phân Loại Chi Tiêu
                            </h2>
                            {expensesByCategory.length > 0 ? (
                                <div className="space-y-4">
                                    {expensesByCategory.map(([category, amount]) => {
                                        const percent = Math.round((amount / stats.expense) * 100);
                                        return (
                                            <div key={category}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-medium text-gray-700">{category}</span>
                                                    <span className="text-gray-500">{formatCurrency(amount)} ({percent}%)</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-indigo-600 h-2.5 rounded-full"
                                                        style={{ width: `${percent}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">Chưa có dữ liệu chi tiêu</p>
                            )}
                        </div>

                        {/* Lịch sử giao dịch */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Lịch sử giao dịch</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-medium">
                                    <tr>
                                        <th className="py-3 px-6">Ngày</th>
                                        <th className="py-3 px-6">Danh mục</th>
                                        <th className="py-3 px-6">Ghi chú</th>
                                        <th className="py-3 px-6 text-right">Số tiền</th>
                                        <th className="py-3 px-6 text-center">Hành động</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50">
                                            <td className="py-3 px-6 text-gray-600">{t.date}</td>
                                            <td className="py-3 px-6 font-medium text-gray-800">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {t.category}
                          </span>
                                            </td>
                                            <td className="py-3 px-6 text-gray-600">{t.note}</td>
                                            <td className={`py-3 px-6 text-right font-bold ${
                                                t.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-400">
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