'use client';

import React, { useState } from 'react';
import { HelpCircle, X, Info, Code, Cpu, Activity, Database, Network } from 'lucide-react';
import clsx from 'clsx';

type TaskId = 1 | 2 | 3 | 4 | 5;

interface ExplanationContent {
    title: string;
    icon: React.ReactNode;
    summary: string;
    howItWorks: {
        step: string;
        details: string;
    }[];
    technicalDetails: string;
}

const EXPLANATIONS: Record<TaskId, ExplanationContent> = {
    1: {
        title: "Logistics Optimization & A* Pathfinding",
        icon: <Cpu className="w-6 h-6 text-red-500" />,
        summary: "Hệ thống tự động hóa vận hành cho xe giao hàng trong không gian 2D ma trận 50x50 (2,500 cells).",
        howItWorks: [
            { step: "A* Heuristic Search", details: "Tìm đường tối ưu bằng hàm f(n) = g(n) + h(n), với h(n) là khoảng cách Manhattan. Thuật toán đảm bảo tìm được quãng đường ngắn nhất trong không gian lưới 4 hướng." },
            { step: "Fuel Safety Protocol", details: "Mỗi bước di chuyển tiêu thụ 0.05 đơn vị xăng. Xe liên tục tính toán khoảng cách tới trạm xăng gần nhất (Refuel Point) và dự phòng biên độ an toàn 0.5 để đảm bảo không bao giờ hết xăng giữa đường." },
            { step: "Greedy Order Batching", details: "Khi chọn đơn tiếp theo, hệ thống tính toán 'Cost' dựa trên tổng quãng đường (Xe -> Lấy -> Giao). Đơn hàng có chi phí thấp nhất và nằm trong tải trọng cho phép (Capacity: 30) sẽ được ưu tiên." }
        ],
        technicalDetails: "Core: TypeScript. Pathfinding: A* với Priority Queue (Map sort). Grid: 50x50. Fuel Consumption: 5% per cell. Rendering: Layered Canvas (Static/Trail/Vehicle)."
    },
    2: {
        title: "Financial Data Engineering",
        icon: <Activity className="w-6 h-6 text-indigo-500" />,
        summary: "Pipeline xử lý và thống kê dữ liệu tài chính đa chiều dựa trên thời gian thực.",
        howItWorks: [
            { step: "Reactive State Management", details: "Sử dụng React hooks (useMemo) để tái tính toán các chỉ số tài chính chỉ khi dữ liệu giao dịch thay đổi, giảm thiểu số lần renders không cần thiết." },
            { step: "Temporal Grouping", details: "Dữ liệu được nhóm theo Tháng/Năm bằng thư viện date-fns, sau đó áp dụng phép tính Aggregate (Sum/Balance) để xuất ra dữ liệu cho biểu đồ Recharts." },
            { step: "Data Categorization", details: "Phân loại giao dịch (Thu nhập/Chi tiêu) thông qua logic lọc động, tự động gán màu sắc và biểu tượng dựa trên metadata của từng danh mục." }
        ],
        technicalDetails: "Storage: Supabase (PostgreSQL). Aggregate: Pure JS Reducers. Charting: Recharts (Line/Pie). Optimization: useMemo cho Transaction Aggregation."
    },
    3: {
        title: "Public Health Behavioral Analytics",
        icon: <Info className="w-6 h-6 text-emerald-500" />,
        summary: "Phân tích xu hướng tâm lý xã hội dựa trên dữ liệu khảo sát YouGov Vietnam COVID-19.",
        howItWorks: [
            { step: "Weighted Population Averaging", details: "Các chỉ số (Khẩu trang, Rửa tay) được tính bằng trung bình có trọng số: (Giá trị x Số người phản hồi) / Tổng mẫu, nhằm đảm bảo tính chính xác khi quy mô mẫu thay đổi giữa các tuần." },
            { step: "Clinical Scoring (PHQ-4)", details: "Điểm trầm cảm được tính theo thang PHQ-4 (0-12), tổng hợp từ các câu hỏi về cảm xúc tiêu cực thường xuyên. Điểm hài lòng cuộc sống sử dụng thang Cantril Ladder (0-10)." },
            { step: "Time-Series Normalization", details: "Dữ liệu tuần được chuẩn hóa về định dạng ISO-8601 để đồng bộ hóa các biểu đồ xu hướng (Area Chart) và so sánh tương quan giữa hành vi vs sức khỏe tinh thần." }
        ],
        technicalDetails: "Source: YouGov Market Research. Metrics: PHQ-4 (Mental Health), Cantril Ladder (Satisfaction). Analysis: Population Proportional Weighting."
    },
    4: {
        title: "COSE Force-Directed Graph Layout",
        icon: <Network className="w-6 h-6 text-blue-500" />,
        summary: "Mô phỏng vật lý để trực quan hóa cấu trúc mạng lưới đại học Việt Nam.",
        howItWorks: [
            { step: "Compound Spring Embedder (COSE)", details: "Sử dụng mô hình vật lý 'Lò xo' (Spring-Electric): các Nodes đẩy nhau và các Edges kéo nhau. Các tham số Gravity (80) và Elasticity (100) được tinh chỉnh để mạng lưới không bị chồng chéo." },
            { step: "Multi-level Hierarchy", details: "Dữ liệu phân cấp: Vùng miền (Parent Node) chứa các Trường (Leaf Nodes). Thuật toán COSE xử lý phân cụm tự nhiên, tự động giữ các trường cùng miền ở gần nhau." },
            { step: "Dynamic Visual Mapping", details: "Kích thước Node là hàm bậc nhất của số lượng sinh viên: f(s) = clamp(25 + s/50000 * 15, 25, 90). Màu sắc được nội suy (Interpolation) dựa trên mật độ giảng viên." }
        ],
        technicalDetails: "Engine: Cytoscape.js. Layout: COSE (Force-directed). Parameters: gravity=80, edgeElasticity=100. Colors: RGB Linear Interpolation."
    },
    5: {
        title: "Schema Management & DDL Generation",
        icon: <Database className="w-6 h-6 text-amber-500" />,
        summary: "Công cụ chuyển đổi trừu tượng từ Metadata sang cấu trúc cơ sở dữ liệu quan hệ.",
        howItWorks: [
            { step: "Metadata Interpretation", details: "Trình phân tích JSON đọc các định nghĩa bảng, kiểu dữ liệu (UUID, Text, Timestamp) và các quan hệ ràng buộc (Constraint) giữa các thực thể." },
            { step: "SQL DDL Transformation", details: "Tự động sinh câu lệnh SQL 'CREATE TABLE' tương thích PostgreSQL, bao gồm xử lý khóa chính (PK), khóa ngoại (FK) và các giá trị mặc định như gen_random_uuid()." },
            { step: "Entity-Relationship Mapping", details: "Số hóa mối quan hệ thông qua sơ đồ ERD, sử dụng tọa độ CSS Flexbox kết hợp để hiển thị các liên kết logic và kiểu dữ liệu trực quan." }
        ],
        technicalDetails: "Language: SQL (Postgres Flavor). Parser: Meta-to-SQL logic. UI: Dual-view (List/ERD). Schema: Normalized to 3rd Normal Form (3NF) patterns."
    }
};

interface Props {
    taskId: TaskId;
    className?: string;
}

export default function AlgorithmExplanation({ taskId, className }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const data = EXPLANATIONS[taskId];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={clsx(
                    "cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-3 sm:py-1.5 w-10 h-10 sm:w-auto sm:h-auto bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full sm:rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-md group",
                    className
                )}
                title="Giải thích thuật toán"
            >
                <HelpCircle className="w-5 h-5 sm:w-4 sm:h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Giải thích thuật toán</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
                                    {data.icon}
                                </div>
                                <h3 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                                    {data.title}
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-zinc-500" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] sm:max-h-[70vh] overflow-y-auto">
                            <div>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                    {data.summary}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400">Cách nó hoạt động</h4>
                                {data.howItWorks.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] sm:text-xs font-bold">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{item.step}</p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 sm:mt-0.5 leading-snug">{item.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Code className="w-4 h-4 text-zinc-400" />
                                    <span className="text-[10px] sm:text-xs font-bold text-zinc-500">Chi tiết kỹ thuật</span>
                                </div>
                                <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 italic leading-relaxed">
                                    {data.technicalDetails}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl sm:rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
                            >
                                Đã hiểu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
