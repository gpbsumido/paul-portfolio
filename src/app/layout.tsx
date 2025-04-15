import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Paul Sumido",
    description: "Portfolio website of Paul Sumido",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

/**
 * RootLayout component - Main layout wrapper
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @description The root layout component that wraps the entire application and provides the font configuration
 * @returns {JSX.Element} Root layout with font configuration
 */
export default function RootLayout({
    children,
}: RootLayoutProps): React.ReactElement {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <LanguageProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
