import { fetchCovidData } from '@/lib/data/covid';
import { CovidDashboard } from '@/components/covid/CovidDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Theo dõi Hành vi & Cảm xúc COVID-19 Việt Nam',
    description: 'Bảng điều khiển tương tác trực quan hóa cảm xúc cộng đồng và hành vi bảo vệ tại Việt Nam trong đại dịch COVID-19 sử dụng dữ liệu YouGov.',
};

export default async function CovidTrackerPage() {
    try {
        const data = await fetchCovidData();

        return (
            <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <CovidDashboard initialData={data} />
                </div>
            </main>
        );
    } catch (error) {
        console.error("Failed to load COVID data", error);
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center max-w-md">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Dữ liệu không khả dụng</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Không thể lấy bộ dữ liệu COVID-19 mới nhất từ YouGov. Vui lòng kiểm tra kết nối internet hoặc thử lại sau.
                    </p>
                    <button
                        // In a real app, use a router refresh here or a client component wrapper
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                        Thử lại (Tải lại trang)
                    </button>
                </div>
            </div>
        );
    }
}
