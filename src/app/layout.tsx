import type { Metadata } from 'next';

import QueryProvider from '@/providers/query-provider';

import './globals.css';

export const metadata: Metadata = {
    title: 'Hazefree',
    description: 'Hazefree',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <QueryProvider>
                <body className={`antialiased`}>{children}</body>
            </QueryProvider>
        </html>
    );
}
