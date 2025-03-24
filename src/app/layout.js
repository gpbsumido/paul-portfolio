export const metadata = {
    title: "Paul's Portfolio",
    description: "Glenn Paul Sumido's Portfolio",
    keywords: "Glenn Paul Sumido, Portfolio, Software Engineer, Web Developer, React, Next.js",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* Fonts moved to _document.js */}
            </head>
            <body>{children}</body>
        </html>
    );
}
