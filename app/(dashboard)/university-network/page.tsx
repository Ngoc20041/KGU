
import UniversityGraph from "@/components/university-graph/UniversityGraph";
import AlgorithmExplanation from "@/components/AlgorithmExplanation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mạng Lưới Các Trường Đại Học Việt Nam",
    description: "Trực quan hóa mạng lưới các trường đại học tại Việt Nam",
};

export default function UniversityNetworkPage() {
    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Mạng Lưới Đại Học Việt Nam
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Bản đồ tương tác các trường đại học theo khu vực
                        </p>
                    </div>
                    <AlgorithmExplanation taskId={4} />
                </div>

                <UniversityGraph />

                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                    <p><strong>Ghi chú:</strong> Dữ liệu về số lượng sinh viên và giảng viên chỉ mang tính chất minh họa và giả lập.</p>
                </div>
            </div>
        </main>
    );
}
