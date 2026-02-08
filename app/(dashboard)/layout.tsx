import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
// Import Sidebar component

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Quản Lý Chi Tiêu",
    description: "Ứng dụng quản lý tài chính cá nhân",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            suppressHydrationWarning={true}
        >
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Area */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 transition-all duration-300">
                {children}
            </main>
        </div>
        </body>
        </html>
    );
}