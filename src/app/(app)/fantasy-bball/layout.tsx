import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

export const metadata: Metadata = {
    title: "Fantasy Basketball",
    description: "Glenn Paul Sumido's Portfolio",
    keywords:
        "Glenn Paul Sumido, Fantasy Basketball, Portfolio, Software Engineer, Web Developer, Next.js, React, TypeScript",
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
    return <ErrorBoundary>{children}</ErrorBoundary>;
}
