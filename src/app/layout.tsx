import type { Metadata } from 'next';
import { Bodoni_Moda } from 'next/font/google';
import './globals.css';

const bodoniModa = Bodoni_Moda({
  variable: '--font-bodoni-moda',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Paul's Portfolio",
  description: "Glenn Paul Sumido's Portfolio",
  keywords:
    'Glenn Paul Sumido, Portfolio, Software Engineer, Web Developer, React, Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodoniModa.variable}`}
        style={{ fontFamily: 'var(--font-bodoni-moda), serif' }}
      >
        {children}
      </body>
    </html>
  );
}
