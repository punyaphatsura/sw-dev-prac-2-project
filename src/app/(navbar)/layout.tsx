'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { useAtom } from 'jotai';
import { Calendar, Home, Store, UserCircle } from 'lucide-react';

import { userAtom } from '@/atom/user-atom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/common/components/base/DropdownMenu';
import Typography from '@/common/components/base/Typography';
import { apiClient } from '@/libs/axiosConfig';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useAtom(userAtom);
    const { push } = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiClient.get('auth/me');
                setUser({
                    id: res.data.data._id,
                    name: res.data.data.name,
                    email: res.data.data.email,
                    tel: res.data.data.tel,
                    role: res.data.data.role,
                });
            } catch (e) {
                push('/auth');
            }
        };
        fetchUser();
    }, [push, setUser]);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            setUser(null);
            push('/auth');
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="sticky top-0 z-10 border-b border-gray-200 bg-[#CBDCEB] shadow-sm backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="flex items-center">
                                <Typography
                                    variant="h4"
                                    className="hover:text-primary/90 font-bold text-primary transition-colors"
                                >
                                    Massage Shop
                                </Typography>
                            </Link>

                            <div className="flex items-center space-x-6">
                                <Link
                                    href="/"
                                    className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-primary"
                                >
                                    <Home size={18} />
                                    <span className="max-lg:hidden">Home</span>
                                </Link>

                                {user?.role === 'admin' && (
                                    <Link
                                        href="/back-office/shop"
                                        className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-primary max-md:hidden"
                                    >
                                        <Store size={18} />
                                        <span className="max-lg:hidden">
                                            Shop Management
                                        </span>
                                    </Link>
                                )}

                                <Link
                                    href="/back-office/booking"
                                    className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-primary"
                                >
                                    <Calendar size={18} />
                                    <span className="max-lg:hidden">
                                        {user?.role === 'admin'
                                            ? 'Booking Management'
                                            : 'Booking'}
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {user && (
                            <div className="flex items-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="focus:outline-none">
                                        <div className="bg-primary/10 hover:bg-primary/20 flex items-center space-x-3 rounded-full px-4 py-2 transition-colors">
                                            <UserCircle
                                                size={24}
                                                className="text-primary"
                                            />
                                            <span className="font-medium text-primary">
                                                {user.name}
                                            </span>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuLabel>
                                            <div className="space-y-1.5">
                                                <p className="font-medium text-gray-900">
                                                    <span className="font-bold">
                                                        Role:{' '}
                                                    </span>
                                                    <span className="text-primary">
                                                        {user.role}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    ID: {user.id}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="cursor-pointer font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
