"use client";

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {
    Home,
    BarChart2,
    Settings,
    Wallet,
    Van,
    Activity,
    Network,
    Database,
    ChevronDown,
    Menu,
    X,
    LucideIcon,
    FileQuestionMark,
} from 'lucide-react';
import {useEffect, useState} from 'react';
import SettingsModal from '@/components/SettingsModal';

type MenuChild = {
    name: string;
    href: string;
    icon: LucideIcon;
};

type MenuItem =
    | {
    name: string;
    icon: LucideIcon;
    href: string;
    children?: never;
}
    | {
    name: string;
    icon: LucideIcon;
    children: MenuChild[];
    href?: never;
};
const MENU_ITEMS: MenuItem[] = [
    {
        name: 'Câu hỏi 1',
        icon:  FileQuestionMark ,
        children: [
            {name: 'Xe giao hàng', href: '/matrix', icon: Van},
        ],
    },
    {
        name: 'Câu hỏi 2 (3)',
        icon: FileQuestionMark,
        children: [
            {name: 'Tổng quan', href: '/', icon: Home},
            {name: 'Báo cáo', href: '/report', icon: BarChart2},
        ],
    },
    {
        name: 'Câu hỏi 3',
        icon: FileQuestionMark,
        children: [
            {name: 'Theo dõi COVID-19', href: '/covid-tracker', icon: Activity},
        ],
    },
    {
        name: 'Câu hỏi 4',
        icon: FileQuestionMark,
        children: [
            {name: 'Mạng lưới Đại Học', href: '/university-network', icon: Network},
        ],
    },
    {
        name: 'Câu hỏi 5',
        icon: FileQuestionMark,
        children: [
            {name: 'Database Schema', href: '/database-schema', icon: Database},
        ],
    },
];


export default function Sidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Auto open parent menu if child active
    useEffect(() => {
        MENU_ITEMS.forEach((item) => {
            if (
                "children" in item &&
                item.children?.some(child =>
                    pathname === child.href ||
                    pathname.startsWith(child.href + '/')
                )
            ) {
                setOpenMenus(prev => ({ ...prev, [item.name]: true }));
            }
        });
    }, [pathname]);


    const toggleMenu = (name: string) => {
        setOpenMenus(prev => ({...prev, [name]: !prev[name]}));
    };

    return (
        <>
            {/* Mobile menu button - touch target 44px+ */}
            <button
                type="button"
                aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
                className="md:hidden fixed top-3 right-3 z-50 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>


            <aside className={`
                      fixed top-0 left-0 z-40 h-screen w-64 max-w-[85vw] md:max-w-none bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800
                       transition-transform duration-300 ease-in-out
                      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                      md:translate-x-0
                  `}>
                <div className="h-full px-3 py-4 overflow-y-auto">

                    {/* Logo */}
                    <div className="flex items-center gap-2 px-2 mb-8">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <Wallet className="w-6 h-6 text-white"/>
                        </div>
                        <span className="text-xl font-bold">ExpenseMgr</span>
                    </div>

                    {/* Menu */}
                    <ul className="space-y-1">
                        {MENU_ITEMS.map((item) => {
                            const Icon = item.icon;

                            // ===== MENU CÓ CON =====
                            if ("children" in item) {
                                const isOpen = openMenus[item.name];

                                return (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100"
                                        >
                                            <Icon className="w-5 h-5 text-gray-500"/>
                                            <span className="ml-3 flex-1 text-left">{item.name}</span>
                                            <ChevronDown
                                                className={`w-4 h-4 transition ${isOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {isOpen && (
                                            <ul className="ml-8 mt-1 space-y-1">
                                                {item.children?.map((child) => {
                                                    const ChildIcon = child.icon;
                                                    const childActive = pathname === child.href;

                                                    return (
                                                        <li key={child.href}>
                                                            <Link
                                                                href={child.href}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className={`flex items-center gap-2 p-2 rounded-md text-sm
                                                                    ${
                                                                        childActive
                                                                            ? 'bg-indigo-50 text-indigo-600'
                                                                            : 'text-gray-600 hover:bg-gray-100'
                                                                    }
                                                                `}
                                                            >
                                                                <ChildIcon className="w-4 h-4"/>
                                                                <span>{child.name}</span>
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            }

                            // ===== MENU 1 CẤP =====
                            const isActive = pathname === item.href;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center p-3 rounded-lg
                                            ${
                                                isActive
                                                    ? 'bg-indigo-50 text-indigo-600'
                                                    : 'hover:bg-gray-100 text-gray-700'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5"/>
                                        <span className="ml-3">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Bottom */}
                    <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsSettingsOpen(true);
                            }}
                            className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                        >
                            <Settings className="w-5 h-5"/>
                            <span className="ml-3">Cài đặt</span>
                        </button>
                    </div>
                </div>
            </aside>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden
                />
            )}

            <SettingsModal
                open={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
}