import { Provider as JotaiProvider } from 'jotai';
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
            <JotaiProvider>
                <QueryProvider>
                    <body className={`antialiased`}>{children}</body>
                </QueryProvider>
            </JotaiProvider>
        </html>
    );
}
