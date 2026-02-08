'use client';

import { ReactNode } from 'react';

interface ChartCardProps {
    title: string;
    children: ReactNode;
    subtitle?: string;
}

export function ChartCard({ title, children, subtitle }: ChartCardProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
                {subtitle && <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
            </div>
            <div className="h-[300px] w-full">
                {children}
            </div>
        </div>
    );
}
