import { Provider as JotaiProvider } from 'jotai';
import type { Metadata } from 'next';

import { Toaster } from '@/common/components/base/Toast/toaster';
import QueryProvider from '@/providers/query-provider';

import './globals.css';

export const metadata: Metadata = {
    title: 'Massage Shop',
    description: 'Massage Shop',
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
                    <body className={`antialiased`}>
                        <Toaster />
                        {children}
                    </body>
                </QueryProvider>
            </JotaiProvider>
        </html>
    );
}
