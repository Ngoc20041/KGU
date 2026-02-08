import DatabaseSchemaClient from "./SchemaClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Database Schema & ERD",
    description: "Database table definitions and visual relationships",
};

export default function DatabaseSchemaPage() {
    return (
        <main className="h-screen flex flex-col bg-gray-50 dark:bg-zinc-950 overflow-hidden">
            <div className="max-w-[1600px] mx-auto w-full p-4 md:p-8 space-y-4 flex-1 flex flex-col min-h-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        Database Schema
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
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
