'use client';

import { useState } from 'react';
import { schemaData, TableDefinition } from '@/lib/schema-meta';
import { Database, Table, Key, Search, ChevronRight, LayoutList, Columns } from 'lucide-react';
import clsx from 'clsx';

export default function SchemaViewer() {
    const [selectedTable, setSelectedTable] = useState<TableDefinition | null>(schemaData[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTables = schemaData.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col sm:flex-row h-full min-h-0 bg-gray-50 dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm">

            {/* Mobile: dropdown to select table */}
            <div className="sm:hidden p-3 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
                <label htmlFor="schema-table-select" className="sr-only">Chọn bảng</label>
                <select
                    id="schema-table-select"
                    value={selectedTable?.name ?? ''}
                    onChange={(e) => {
                        const t = schemaData.find(tbl => tbl.name === e.target.value);
                        setSelectedTable(t ?? null);
                    }}
                    className="w-full py-2.5 pl-3 pr-8 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                    {schemaData.map(table => (
                        <option key={table.name} value={table.name}>{table.name}</option>
                    ))}
                </select>
            </div>

            {/* Sidebar - Table List (desktop) */}
            <div className="hidden sm:flex w-64 shrink-0 flex-col bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800">
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Find a table..."
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-between items-center">
                        <span>All Tables</span>
                        <span className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">{filteredTables.length}</span>
                    </div>
                    {filteredTables.map(table => (
                        <button
                            key={table.name}
                            onClick={() => setSelectedTable(table)}
                            className={clsx(
                                "w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 group transition-colors",
                                selectedTable?.name === table.name
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-medium"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                            )}
                        >
                            <Table className={clsx("w-4 h-4", selectedTable?.name === table.name ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400")} />
                            <span className="truncate">{table.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content - Table Details */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900 overflow-hidden">
                {selectedTable ? (
                    <>
                        {/* Header */}
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-start bg-white dark:bg-zinc-900 shrink-0">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    <Database className="w-3.5 h-3.5 shrink-0" />
                                    <span>public</span>
                                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                                    <span>Tables</span>
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                                    {selectedTable.name}
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {selectedTable.columns.length} columns
                                </p>
                            </div>
                        </div>

                        {/* Tabs (Visual only for now) */}
                        <div className="px-4 sm:px-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-black/20 shrink-0">
                            <div className="flex gap-4 sm:gap-6">
                                <button type="button" className="py-2.5 sm:py-3 text-sm font-medium border-b-2 border-emerald-500 text-emerald-700 dark:text-emerald-400">
                                    Columns
                                </button>
                                <button type="button" className="py-2.5 sm:py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400">
                                    Policies
                                </button>
                            </div>
                        </div>

                        {/* Grid - scroll horizontally on mobile */}
                        <div className="flex-1 overflow-auto min-h-0">
                            <table className="w-full text-left border-collapse min-w-[400px]">
                                <thead className="bg-gray-50 dark:bg-zinc-800/50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800">
                                            Name
                                        </th>
                                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800 hidden sm:table-cell">
                                            Description
                                        </th>
                                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800">
                                            Type
                                        </th>
                                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800 hidden sm:table-cell">
                                            Format
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                    {selectedTable.columns.map((col, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 group">
                                            <td className="px-3 sm:px-6 py-2 sm:py-3 border-b border-gray-100 dark:border-zinc-800/50">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{col.name}</span>
                                                    {col.isPrimaryKey && (
                                                        <span title="Primary Key" className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                                                            <Key className="w-2.5 h-2.5" /> PK
                                                        </span>
                                                    )}
                                                    {col.foreignKey && (
                                                        <span title={`Foreign Key to ${col.foreignKey}`} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 cursor-help">
                                                            FK
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-800/50 hidden sm:table-cell">
                                                {col.foreignKey && (
                                                    <span className="text-indigo-600 dark:text-indigo-400 text-xs">
                                                        → {col.foreignKey}
                                                    </span>
                                                )}
                                                {!col.foreignKey && <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-3 sm:px-6 py-2 sm:py-3 border-b border-gray-100 dark:border-zinc-800/50">
                                                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono">
                                                    {col.type}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-800/50 font-mono text-xs hidden sm:table-cell">
                                                {col.format}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <LayoutList className="w-12 h-12 mb-3 opacity-20" />
                        <p>Select a table to view its schema</p>
                    </div>
                )}
            </div>
        </div>
    );
}
