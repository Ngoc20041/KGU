'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Mail, Lock, User, Wallet, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function AuthModal() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'login' | 'register'>('login');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Show modal if not logged in
    useEffect(() => {
        if (!isAuthLoading && !user) {
            setIsOpen(true);
        } else if (user) {
            setIsOpen(false);
        }
    }, [user, isAuthLoading]);

    const handleClose = () => {
        // Only allow closing if authenticated
        if (user) {
            setIsOpen(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (signInError) throw signInError;
        } catch (err: any) {
            setError(err.message || 'Đã xảy ra lỗi khi đăng nhập');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu nhập lại không khớp');
            return;
        }

        setIsLoading(true);

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                    }
                }
            });

            if (signUpError) throw signUpError;

            alert("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");
            setView('login');
        } catch (err: any) {
            setError(err.message || 'Đã xảy ra lỗi khi đăng ký');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Brand */}
                <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {view === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                        {view === 'login'
                            ? 'Vui lòng đăng nhập để truy cập hệ thống'
                            : 'Tham gia đánh giá năng lực cùng KGU'}
                    </p>
                </div>

                {/* Form Body */}
                <div className="p-8">
                    <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
                        {view === 'register' && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Họ và tên</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="Nguyễn Văn A"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Địa chỉ Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="example@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {view === 'register' && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Xác nhận mật khẩu</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                view === 'login' ? 'Đăng nhập' : 'Đăng ký'
                            )}
                        </button>
                    </form>

                    {/* Switch View */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {view === 'login' ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{' '}
                            <button
                                onClick={() => {
                                    setView(view === 'login' ? 'register' : 'login');
                                    setError('');
                                }}
                                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                            >
                                {view === 'login' ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Optional Footer/Link */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/30 text-center">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                        © 2026 KGU Đánh Giá Năng Lực
                    </p>
                </div>
            </div>
        </div>
    );
}
