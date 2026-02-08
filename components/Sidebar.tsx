"use client";

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {
    Home,
    BarChart2,
    LogIn,
    UserPlus,
    Settings,
    Wallet,
    Van,
    Activity,
    Network,
    Database,
} from 'lucide-react';
import {useState} from 'react';

const MENU_ITEMS = [
    {name: 'Tổng quan', href: '/', icon: Home},
    {name: 'Báo cáo', href: '/report', icon: BarChart2},
    {name: 'Theo dõi COVID-19', href: '/covid-tracker', icon: Activity},
    {name: 'Đăng nhập', href: '/login', icon: LogIn},
    {name: 'Đăng ký', href: '/register', icon: UserPlus},
    {name: 'Mạng lưới Đại Học', href: '/university-network', icon: Network},
    {name: 'Database Schema', href: '/database-schema', icon: Database},
    {name: 'Xe giao hàng', href: '/matrix', icon: Van},
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-md shadow-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
                </svg>
            </button>

            {/* Sidebar Container */}
            <aside className={`
                    fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                `}>
                <div className="h-full px-3 py-4 overflow-y-auto">
                    {/* Logo / Brand */}
                    <div className="flex items-center gap-2 px-2 mb-8 mt-2">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <Wallet className="w-6 h-6 text-white"/>
                        </div>
                        <span className="text-xl font-bold text-gray-800">ExpenseMgr</span>
                    </div>

                    {/* Navigation Links */}
                    <ul className="space-y-2 font-medium">
                        {MENU_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)} // Close menu on mobile click
                                        className={`
                                        flex items-center p-3 rounded-lg group transition-colors
                                        ${isActive
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                                        `}
                                    >
                                        <Icon
                                            className={`w-5 h-5 transition duration-75 ${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-900'}`}/>
                                        <span className="ml-3">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Bottom Section (Optional) */}
                    <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200">
                        <button
                            className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Settings className="w-5 h-5 text-gray-500"/>
                            <span className="ml-3">Cài đặt</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}