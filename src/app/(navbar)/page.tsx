'use client';

import { useEffect, useState } from 'react';

import { Shop } from '@/common/interface/shop';
import { apiClient } from '@/libs/axiosConfig';

import ShopCard from './_components/ShopCard';

export default function Home() {
    const [shops, setShops] = useState<Shop[]>([]);

    useEffect(() => {
        // Fetch shop data
        const fetchData = async () => {
            const response = await apiClient.get('/shops');
            setShops(response.data.data);
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="mx-auto grid w-full max-w-[1000px] grid-cols-4 gap-2 px-10 max-[1000px]:hidden">
                {Array.from({ length: 4 }).map((_, col) => (
                    <div
                        className="flex min-h-[50px] w-full flex-col gap-2"
                        key={`col-${col}`}
                    >
                        {shops
                            .filter((_, index) => index % 4 === col)
                            .map((shop) => (
                                <ShopCard
                                    key={shop.id}
                                    id={`4-${col}-${shop.id}`}
                                    imageUrl={shop.picture}
                                    shop={shop}
                                />
                            ))}
                    </div>
                ))}
            </div>
            <div className="mx-auto hidden w-full grid-cols-3 gap-2 max-[1000px]:grid max-[500px]:hidden">
                {Array.from({ length: 3 }).map((_, col) => (
                    <div
                        className="flex min-h-[50px] w-full flex-col gap-2"
                        key={`col-${col}`}
                    >
                        {shops
                            .filter((_, index) => index % 3 === col)
                            .map((shop) => (
                                <ShopCard
                                    key={shop.id}
                                    id={`3-${col}-${shop.id}`}
                                    imageUrl={shop.picture}
                                    shop={shop}
                                />
                            ))}
                    </div>
                ))}
            </div>
            <div className="mx-auto hidden w-full grid-cols-2 gap-2 max-[500px]:grid">
                {Array.from({ length: 2 }).map((_, col) => (
                    <div
                        className="flex min-h-[50px] w-full flex-col gap-2"
                        key={`col-${col}`}
                    >
                        {shops
                            .filter((_, index) => index % 2 === col)
                            .map((shop) => (
                                <ShopCard
                                    key={shop.id}
                                    id={`2-${col}-${shop.id}`}
                                    imageUrl={shop.picture}
                                    shop={shop}
                                />
                            ))}
                    </div>
                ))}
            </div>
        </>
    );
}
