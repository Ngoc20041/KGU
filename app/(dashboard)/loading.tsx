export default function Loading() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black p-8">
            <div className="max-w-7xl mx-auto animate-pulse">
                <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
            </div>
        </main>
    );
}
