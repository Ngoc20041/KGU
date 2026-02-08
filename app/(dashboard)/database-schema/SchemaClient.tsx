
'use client';

import { useState } from 'react';
import SchemaViewer from "@/components/schema/SchemaViewer";
import SchemaERD from "@/components/schema/SchemaERD";
import { LayoutList, Network } from 'lucide-react';
import clsx from 'clsx';

export default function DatabaseSchemaClient() {
    const [viewMode, setViewMode] = useState<'list' | 'erd'>('list');

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex justify-end">
                <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg border border-gray-200 dark:border-zinc-700">
                    <button
                        onClick={() => setViewMode('list')}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                            viewMode === 'list'
                                ? "bg-white dark:bg-zinc-600 text-gray-900 dark:text-gray-100 shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        )}
                    >
                        <LayoutList className="w-4 h-4" />
                        <span>List View</span>
                    </button>
                    <button
                        onClick={() => setViewMode('erd')}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                            viewMode === 'erd'
                                ? "bg-white dark:bg-zinc-600 text-gray-900 dark:text-gray-100 shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        )}
                    >
                        <Network className="w-4 h-4" />
                        <span>ERD View</span>
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
