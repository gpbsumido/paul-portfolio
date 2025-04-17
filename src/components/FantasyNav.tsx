"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FantasyNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="bg-white shadow-md mb-8">
            <div className="container mx-auto px-4">
                <div className="flex space-x-8">
                    <Link
                        href="/fantasy-bball/league"
                        className={`py-4 px-2 border-b-2 ${
                            isActive("/fantasy-bball/league")
                                ? "border-blue-500 text-blue-500"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        League
                    </Link>
                    <Link
                        href="/fantasy-bball/history/2024"
                        className={`py-4 px-2 border-b-2 ${
                            isActive("/fantasy-bball/history/2024")
                                ? "border-blue-500 text-blue-500"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        History
                    </Link>
                </div>
            </div>
        </nav>
    );
}
