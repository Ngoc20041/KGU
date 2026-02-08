
import { Handle, Position } from 'reactflow';
import { ColumnDefinition } from '@/lib/schema-meta';
import { Key } from 'lucide-react';
import clsx from 'clsx';

interface TableNodeData {
    name: string;
    columns: ColumnDefinition[];
    isSelected?: boolean;
}

export function TableNode({ data }: { data: TableNodeData }) {
    return (
        <div className={clsx(
            "min-w-60 bg-white dark:bg-zinc-900 border rounded-lg shadow-sm overflow-hidden",
            data.isSelected ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-gray-200 dark:border-zinc-700"
        )}>
            {/* Header */}
            <div className="bg-gray-50 dark:bg-zinc-800 px-3 py-2 border-b border-gray-200 dark:border-zinc-700 text-sm font-bold text-gray-800 dark:text-gray-100 flex justify-between items-center">
                <span>{data.name}</span>
                <span className="text-xs font-normal text-gray-500">{data.columns.length} cols</span>
            </div>

            {/* Columns */}
            <div className="flex flex-col text-xs">
                {data.columns.map((col, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            "px-3 py-1.5 flex justify-between items-center relative group hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors",
                            idx !== data.columns.length - 1 && "border-b border-gray-100 dark:border-zinc-800/50"
                        )}
                    >
                        {/* Handles based on if it's PK, FK or referenced */}
                        {/* Simplified: One general handle for all inputs/outputs on sides */}
                        <Handle type="target" position={Position.Left} className="!bg-transparent !border-none !w-0 !h-0" id={`${col.name}-left`} />

                        <div className="flex items-center gap-2 overflow-hidden mr-2">
                            {col.isPrimaryKey && (
                                <Key className="w-3 h-3 text-amber-500 flex-shrink-0" />
                            )}
                            <span className={clsx("font-mono truncate", col.isPrimaryKey && "font-bold text-gray-900 dark:text-gray-100", !col.isPrimaryKey && "text-gray-600 dark:text-gray-300")}>
                                {col.name}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-[10px] text-gray-400 font-mono">{col.type}</span>
                            {col.foreignKey && (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" title={`FK -> ${col.foreignKey}`}></span>
                            )}
                        </div>

                        <Handle type="source" position={Position.Right} className="!bg-transparent !border-none !w-0 !h-0" id={`${col.name}-right`} />
                    </div>
                ))}
            </div>
        </div>
    );
}
