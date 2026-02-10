"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Settings as SettingsIcon,
  Save,
  Check,
  X,
  User,
  Info,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  getStoredSettings,
  applyTheme,
  type AppSettings,
} from "@/lib/settings";



type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SettingsModal({ open, onClose }: Props) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null);

  const loadSettingsAndUser = useCallback(async () => {
    setSettings(getStoredSettings());
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setUser({ email: data.user.email, id: data.user.id });
    }
  }, []);

  useEffect(() => {
    if (open) loadSettingsAndUser();
  }, [open, loadSettingsAndUser]);

  const handleChange = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : null));
  };



  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <h2
            id="settings-title"
            className="text-xl font-bold text-gray-800 flex items-center gap-2"
          >
            <SettingsIcon className="w-6 h-6 text-indigo-600" />
            Cài đặt
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="overflow-y-auto p-4 space-y-4">
          {settings === null ? (
            <div className="py-8 text-center text-gray-500">Đang tải...</div>
          ) : (
            <>
              {/* Thông tin tài khoản */}
              <section className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-gray-100 dark:border-zinc-700 mb-2">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  Tài khoản
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Email</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.email || "Chưa đăng nhập"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">UID</span>
                    <span className="text-xs font-mono text-gray-400 truncate max-w-[150px]" title={user?.id}>{user?.id || "—"}</span>
                  </div>
                </div>
              </section>

              {/* Thông tin ứng dụng */}
              <section className="bg-indigo-50/50 dark:bg-indigo-900/10 p-3 rounded-xl border border-indigo-100/50 dark:border-indigo-900/20 mb-6">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-600" />
                  Thông tin ứng dụng
                </h3>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>Phiên bản: 1.0 (beta)</p>
                  <p>Hệ thống: KGU đánh giá năng lực</p>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col-reverse sm:flex-row gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[44px] py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 touch-manipulation"
          >
            Đóng
          </button>

        </div>
      </div>
    </div>
  );
}
