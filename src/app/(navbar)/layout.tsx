'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { useAtom } from 'jotai';

import { userAtom } from '@/atom/user-atom';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from '@/common/components/base/DropdownMenu';
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
                console.log(e);
                push('/auth');
            }
        };

        fetchUser();
    }, [push, setUser]);

    return (
        <div className="flex flex-col">
            {/* Navbar */}
            <div className="sticky top-0 z-10 flex h-[80px] w-full flex-row items-center bg-[#F3F3E0] p-6">
                <div className="flex w-full flex-row gap-2">
                    <Link href="/">
                        <Typography variant="h4" className="ml-4">
                            Massage Shop Website
                        </Typography>
                    </Link>

                    {user?.role === 'admin' && (
                        <Link href="/back-office/shop">Shop Management</Link>
                    )}
                    <Link href="/back-office/booking">
                        {user?.role === 'admin'
                            ? 'Booking Management'
                            : 'Booking'}
                    </Link>

                    <Link href="/auth">Logout</Link>

                    <Typography variant="h4" className="ml-auto">
                        {user?.name} | {user?.role}
                    </Typography>
                </div>
                {/* {user && (
                    <div className="ml-auto flex flex-row">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Typography variant="h4" className="ml-4">
                                    {user.name}
                                </Typography>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Billing</DropdownMenuItem>
                                <DropdownMenuItem>Team</DropdownMenuItem>
                                <DropdownMenuItem>
                                    Subscription
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu> 
                    </div>
                )} */}
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}
