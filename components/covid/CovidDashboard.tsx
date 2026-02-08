'use client';

import { useState, useMemo } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChartCard } from './ChartCard';
import { DashboardData } from '@/lib/data/covid';
import { Users, ShieldCheck, Brain, Heart, Calendar } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CovidDashboardProps {
    initialData: DashboardData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function CovidDashboard({ initialData }: CovidDashboardProps) {
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>(() => {
        if (!initialData.weeklyData.length) return { start: '', end: '' };
        return {
            start: initialData.weeklyData[0].weekStart,
            end: initialData.weeklyData[initialData.weeklyData.length - 1].weekStart
        };
    });

    // Filter Data Logic
    const filteredData = useMemo(() => {
        if (!dateRange.start || !dateRange.end) return initialData.weeklyData;
        const start = parseISO(dateRange.start).getTime();
        const end = parseISO(dateRange.end).getTime();

        return initialData.weeklyData.filter(d => {
            const t = parseISO(d.weekStart).getTime();
            return t >= start && t <= end;
        });
    }, [initialData, dateRange]);

    // Handle Date Change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
        const val = e.target.value;
        setDateRange(prev => ({
            ...prev,
            [type]: val
        }));
    };

    // Calculate Summaries Based on Filtered Data
    const summary = useMemo(() => {
        if (filteredData.length === 0) return { respondents: 0, mask: 0, depression: 0, life: 0 };
        const total = filteredData.reduce((acc, d) => acc + d.totalRespondents, 0);
        const avgMask = filteredData.reduce((acc, d) => acc + (d.maskwearingPct * d.totalRespondents), 0) / total;
        const avgDepress = filteredData.reduce((acc, d) => acc + (d.avgDepressionScore * d.totalRespondents), 0) / total;
        const avgLife = filteredData.reduce((acc, d) => acc + (d.avgLifeSatisfaction * d.totalRespondents), 0) / total;

        return {
            respondents: total,
            mask: avgMask,
            depression: avgDepress,
            life: avgLife
        };
    }, [filteredData]);

    // Demographics Data for Pie Chart
    const ageData = useMemo(() => {
        return Object.entries(initialData.ageDistribution).map(([name, value]) => ({ name, value }));
    }, [initialData]);

    const genderData = useMemo(() => {
        return Object.entries(initialData.genderDistribution).map(([name, value]) => ({ name, value }));
    }, [initialData]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                        Theo dõi COVID-19 tại Việt Nam
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Phân tích Cảm xúc & Hành vi Cộng đồng (Dữ liệu YouGov)
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <Calendar className="w-5 h-5 text-zinc-500" />
                    <div className="flex items-center gap-2">
                        <input type="date"
                            className="bg-transparent text-sm outline-none text-zinc-700 dark:text-zinc-300"
                            onChange={(e) => handleDateChange(e, 'start')}
                            value={dateRange.start}
                        />
                        <span className="text-zinc-400">-</span>
                        <input type="date"
                            className="bg-transparent text-sm outline-none text-zinc-700 dark:text-zinc-300"
                            onChange={(e) => handleDateChange(e, 'end')}
                            value={dateRange.end}
                        />
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    icon={<Users className="w-6 h-6 text-blue-500" />}
                    label="Người tham gia"
                    value={summary.respondents.toLocaleString()}
                    trend="Tổng mẫu khảo sát"
                    color="blue"
                />
                <SummaryCard
                    icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
                    label="Tuân thủ khẩu trang"
                    value={`${summary.mask.toFixed(1)}%`}
                    trend="Tần suất trung bình"
                    color="emerald"
                />
                <SummaryCard
                    icon={<Brain className="w-6 h-6 text-purple-500" />}
                    label="Điểm Trầm cảm"
                    value={summary.depression.toFixed(2)}
                    trend="Thang PHQ-4 (0-12)"
                    color="purple"
                />
                <SummaryCard
                    icon={<Heart className="w-6 h-6 text-rose-500" />}
                    label="Hài lòng cuộc sống"
                    value={summary.life.toFixed(2)}
                    trend="Thang Cantril (0-10)"
                    color="rose"
                />
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Trend 1: Behaviors */}
                <ChartCard title="Hành vi Bảo vệ theo Thời gian" subtitle="Tỷ lệ người luôn/thường xuyên tuân thủ">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={filteredData}>
                            <defs>
                                <linearGradient id="colorMask" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorHand" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="weekStart" tickFormatter={(str) => format(parseISO(str), 'MMM yyyy', { locale: vi })} style={{ fontSize: '12px' }} />
                            <YAxis domain={[0, 100]} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                            <Legend />
                            <Area type="monotone" dataKey="maskwearingPct" name="Đeo khẩu trang" stroke="#10b981" fillOpacity={1} fill="url(#colorMask)" />
                            <Area type="monotone" dataKey="handwashingPct" name="Rửa tay" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHand)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Trend 2: Mental Health vs Life Satisfaction */}
                <ChartCard title="Sức khỏe Tinh thần & Hài lòng Cuộc sống" subtitle="Điểm trung bình mỗi tuần">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="weekStart" tickFormatter={(str) => format(parseISO(str), 'MMM yyyy', { locale: vi })} style={{ fontSize: '12px' }} />
                            <YAxis yAxisId="left" domain={[0, 12]} label={{ value: 'Trầm cảm (0-12)', angle: -90, position: 'insideLeft', style: { fill: '#a855f7' } }} />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} label={{ value: 'Hài lòng (0-10)', angle: 90, position: 'insideRight', style: { fill: '#f43f5e' } }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="avgDepressionScore" name="Trầm cảm (PHQ4)" stroke="#a855f7" strokeWidth={2} dot={false} />
                            <Line yAxisId="right" type="monotone" dataKey="avgLifeSatisfaction" name="Hài lòng cuộc sống" stroke="#f43f5e" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Demographics: Age */}
                <ChartCard title="Phân bổ Độ tuổi" subtitle="Người tham gia theo nhóm tuổi">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={ageData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {ageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'white', borderColor: '#374151', color: '#fff' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Behavior Breakdown Bar Chart - Crowd Avoidance */}
                <ChartCard title="Tránh tụ tập đông người" subtitle="% Tránh nơi đông người">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredData.slice(-10)}> {/* Last 10 weeks only for readability */}
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="weekStart" tickFormatter={(str) => format(parseISO(str), 'dd/MM', { locale: vi })} style={{ fontSize: '10px' }} />
                            <YAxis domain={[0, 100]} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                            <Bar dataKey="avoidingCrowdsPct" name="Tránh đám đông" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

            </div>
        </div>
    );
}

function SummaryCard({ icon, label, value, trend, color }: { icon: any, label: string, value: string, trend: string, color: string }) {
    const bgColors: Record<string, string> = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={clsx("p-3 rounded-lg", bgColors[color])}>
                    {icon}
                </div>
                <span className={clsx("text-xs font-medium px-2 py-1 rounded-full", bgColors[color])}>
                    {trend}
                </span>
            </div>
            <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 tracking-wide font-medium">{label}</p>
                <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{value}</h3>
            </div>
        </div>
    )
}
