export const metadata = {
    title: "My Next.js App",
    description: "Awesome app description",
    icons: "/favicon.ico",
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
