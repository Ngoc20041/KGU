
'use client';

import { useState } from 'react';
import SchemaViewer from "@/components/schema/SchemaViewer";
import SchemaERD from "@/components/schema/SchemaERD";
import { LayoutList, Network, Copy, Check } from 'lucide-react';
import clsx from 'clsx';
import { schemaData } from '@/lib/schema-meta';
import { getSchemaAsSql } from '@/lib/schema-to-sql';

export default function DatabaseSchemaClient() {
    const [viewMode, setViewMode] = useState<'list' | 'erd'>('list');
    const [copied, setCopied] = useState(false);

    const handleCopySchema = async () => {
        const sql = getSchemaAsSql(schemaData);
        try {
            await navigator.clipboard.writeText(sql);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback: select a hidden textarea
            const el = document.createElement('textarea');
            el.value = sql;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col h-full gap-3 sm:gap-4 min-h-0">
            <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 sm:gap-3 shrink-0">
                <button
                    type="button"
                    onClick={handleCopySchema}
                    className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all",
                        copied
                            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                            : "bg-white dark:bg-zinc-700 border-gray-200 dark:border-zinc-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-600"
                    )}
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="truncate">{copied ? "Đã copy!" : "Sao chép schema"}</span>
                </button>
                <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg border border-gray-200 dark:border-zinc-700 w-full sm:w-auto justify-center">
                    <button
                        type="button"
                        onClick={() => setViewMode('list')}
                        className={clsx(
                            "flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 text-sm font-medium rounded-md transition-all touch-manipulation",
                            viewMode === 'list'
                                ? "bg-white dark:bg-zinc-600 text-gray-900 dark:text-gray-100 shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        )}
                    >
                        <LayoutList className="w-4 h-4 shrink-0" />
                        <span>List</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('erd')}
                        className={clsx(
                            "flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 text-sm font-medium rounded-md transition-all touch-manipulation",
                            viewMode === 'erd'
                                ? "bg-white dark:bg-zinc-600 text-gray-900 dark:text-gray-100 shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        )}
                    >
                        <Network className="w-4 h-4 shrink-0" />
                        <span>ERD</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
                {viewMode === 'list' ? (
                    <SchemaViewer />
                ) : (
                    <SchemaERD />
                )}
            </div>
        </div>
    );
}
