"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Settings as SettingsIcon,
  DollarSign,
  Palette,
  Globe,
  Bell,
  Calendar,
  Save,
  Check,
  X,
} from "lucide-react";
import {
  getStoredSettings,
  saveSettings,
  applyTheme,
  type AppSettings,
  type Currency,
  type Theme,
  type Language,
} from "@/lib/settings";

const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: "VND", label: "VNĐ" },
  { value: "USD", label: "USD" },
];

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Sáng" },
  { value: "dark", label: "Tối" },
  { value: "system", label: "Hệ thống" },
];

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" },
];

const START_OF_WEEK_OPTIONS: { value: 0 | 1; label: string }[] = [
  { value: 0, label: "Chủ nhật" },
  { value: 1, label: "Thứ hai" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SettingsModal({ open, onClose }: Props) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  const loadSettings = useCallback(() => {
    setSettings(getStoredSettings());
  }, []);

  useEffect(() => {
    if (open) loadSettings();
  }, [open, loadSettings]);

  const handleChange = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : null));
    setSaved(false);
  };

  const handleSave = () => {
    if (!settings) return;
    saveSettings(settings);
    applyTheme(settings.theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
              {/* Tiền tệ */}
              <section>
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-indigo-600" />
                  Tiền tệ
                </h3>
                <div className="flex flex-wrap gap-2">
                  {CURRENCY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChange("currency", opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                        settings.currency === opt.value
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* Giao diện */}
              <section>
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  Giao diện
                </h3>
                <div className="flex flex-wrap gap-2">
                  {THEME_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChange("theme", opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                        settings.theme === opt.value
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* Ngôn ngữ */}
              <section>
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  Ngôn ngữ
                </h3>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    handleChange("language", e.target.value as Language)
                  }
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </section>

              {/* Thông báo */}
              <section>
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  Thông báo
                </h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) =>
                      handleChange("notifications", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    Bật thông báo nhắc nhở
                  </span>
                </label>
              </section>

              {/* Đầu tuần */}
              <section>
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Tuần bắt đầu từ
                </h3>
                <div className="flex flex-wrap gap-2">
                  {START_OF_WEEK_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChange("startOfWeek", opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                        settings.startOfWeek === opt.value
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
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
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 min-h-[44px] py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium touch-manipulation"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                Đã lưu
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Lưu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
