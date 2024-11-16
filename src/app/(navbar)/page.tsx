'use client';

import { useEffect, useState } from 'react';

import { Skeleton } from '@/common/components/base/Skeleton';
import { Shop } from '@/common/interface/shop';
import { apiClient } from '@/libs/axiosConfig';

import ShopCard from './_components/ShopCard';

const ShopSkeleton = ({ height }: { height: number }) => {
    return <Skeleton className={`flex w-full`} style={{ height }} />;
};

export default function Home() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get('/shops');
                setShops(response.data.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to load shops. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderColumn = (colCount: number, col: number) => (
        <div
            className="flex min-h-[50px] w-full flex-col gap-2"
            key={`col-${col}`}
        >
            {isLoading
                ? Array.from({ length: 6 }).map((_, index) => {
                      const height = Math.floor(Math.random() * 200) + 200;
                      return (
                          <ShopSkeleton
                              height={height}
                              key={`skeleton-${col}-${index}`}
                          />
                      );
                  })
                : shops
                      .filter((_, index) => index % colCount === col)
                      .map((shop) => (
                          <ShopCard
                              key={shop.id}
                              id={`${colCount}-${col}-${shop.id}`}
                              imageUrl={shop.picture}
                              shop={shop}
                          />
                      ))}
        </div>
    );

    if (error) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto grid w-full max-w-[1000px] grid-cols-4 gap-2 px-10 max-[1000px]:hidden">
                {Array.from({ length: 4 }).map((_, col) =>
                    renderColumn(4, col)
                )}
            </div>
            <div className="mx-auto hidden w-full grid-cols-3 gap-2 max-[1000px]:grid max-[500px]:hidden">
                {Array.from({ length: 3 }).map((_, col) =>
                    renderColumn(3, col)
                )}
            </div>
            <div className="mx-auto hidden w-full grid-cols-2 gap-2 max-[500px]:grid">
                {Array.from({ length: 2 }).map((_, col) =>
                    renderColumn(2, col)
                )}
            </div>
        </>
    );
}
