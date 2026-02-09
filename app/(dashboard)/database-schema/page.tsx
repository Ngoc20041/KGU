import DatabaseSchemaClient from "./SchemaClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Database Schema & ERD",
    description: "Database table definitions and visual relationships",
};

export default function DatabaseSchemaPage() {
    return (
        <main className="flex flex-col bg-gray-50 dark:bg-zinc-950 overflow-hidden min-h-full">
            <div className="max-w-[1600px] mx-auto w-full px-3 py-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 flex-1 flex flex-col min-h-0">
                <div className="flex flex-col gap-1 shrink-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Database Schema
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        View table definitions and visual relationships
                    </p>
                </div>

                <div className="flex-1 min-h-0">
                    <DatabaseSchemaClient />
                </div>
            </div>
        </main>
    );
}
