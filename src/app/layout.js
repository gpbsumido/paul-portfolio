/**
 * Metadata for the portfolio website
 * @type {Object}
 * @property {string} title - Website title
 * @property {string} description - Website description
 * @property {string} keywords - SEO keywords
 */
export const metadata = {
    title: "Paul's Portfolio",
    description: "Glenn Paul Sumido's Portfolio",
    keywords:
        "Glenn Paul Sumido, Portfolio, Software Engineer, Web Developer, React, Next.js",
};

/**
 * RootLayout component - Main layout wrapper
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @description The root layout component that wraps the entire application
 * @returns {JSX.Element} Root layout with HTML structure
 */
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>{/* Fonts moved to _document.js */}</head>
            <body>{children}</body>
        </html>
    );
}
