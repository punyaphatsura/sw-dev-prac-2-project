'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleDollarSign, Loader2, Plus } from 'lucide-react';
import * as z from 'zod';

import Button from '@/common/components/base/Button';
import { Dialog, DialogContent } from '@/common/components/base/Dialog/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/common/components/base/Form/form';
import Input from '@/common/components/base/Input';
import { Skeleton } from '@/common/components/base/Skeleton';
import Typography from '@/common/components/base/Typography';
import { Shop } from '@/common/interface/shop';
import { apiClient } from '@/libs/axiosConfig';

const ShopSkeleton = () => (
    <div className="flex items-center gap-2 rounded-sm border p-4 max-sm:flex-col">
        <Skeleton className="h-6 w-32" /> {/* Shop name */}
        <Skeleton className="h-4 w-96 max-sm:w-full" /> {/* Address */}
        <div className="flex flex-row items-center gap-0 max-sm:w-full">
            {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="mx-0.5 h-5 w-5 rounded-full" />
            ))}
        </div>
        <div className="ml-auto flex flex-row items-center gap-2">
            <Skeleton className="h-8 w-16" /> {/* Edit button */}
            <Skeleton className="h-8 w-16" /> {/* Delete button */}
        </div>
    </div>
);

const ShopManagementPage = () => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentShop, setCurrentShop] = useState<Shop | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        // Fetch shop data
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get('/shops');
                setShops(response.data.data);
            } catch (error) {
                console.error('Failed to fetch shops:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const formSchema = z.object({
        name: z.string().nonempty('Name is required'),
        address: z.string().nonempty('Address is required'),
        priceLevel: z.string().min(0, 'Price level must be at least 0'),
        province: z.string().nonempty('Province is required'),
        postalcode: z.string().regex(/^\d{5}$/, 'Postal code must be 5 digits'),
        tel: z.string().regex(/^\d+$/, 'Phone number must be numeric'),
        picture: z.string().url('Picture must be a valid URL'),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            address: '',
            priceLevel: '',
            province: '',
            postalcode: '',
            tel: '',
            picture: '',
        },
    });

    const openCreateDialog = () => {
        setEditMode(false);
        setCurrentShop(null);
        form.reset();
        setOpen(true);
    };

    const openEditDialog = (shop: Shop) => {
        setEditMode(true);
        setCurrentShop(shop);
        form.reset({
            name: shop.name,
            address: shop.address,
            priceLevel: String(shop.priceLevel),
            province: shop.province,
            postalcode: shop.postalcode,
            tel: shop.tel,
            picture: shop.picture,
        });
        setOpen(true);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            if (editMode && currentShop) {
                // Update existing shop
                await apiClient.put(`/shops/${currentShop.id}`, {
                    name: values.name,
                    address: values.address,
                    priceLevel: values.priceLevel,
                    province: values.province,
                    postalcode: values.postalcode,
                    tel: values.tel,
                    picture: values.picture,
                });

                setShops((prev) =>
                    prev.map((shop) =>
                        shop.id === currentShop.id
                            ? {
                                  ...shop,
                                  ...values,
                                  priceLevel: parseInt(values.priceLevel),
                              }
                            : shop
                    )
                );
            } else {
                // Create new shop
                const response = await apiClient.post('/shops', values);
                setShops((prev) => [...prev, response.data]);
                window.location.reload();
            }

            form.reset();
            setOpen(false);
        } catch (error) {
            console.error('Failed to submit shop:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (shopId: string) => {
        try {
            setIsDeleting(shopId);
            await apiClient.delete(`/shops/${shopId}`);
            setShops((prev) => prev.filter((s) => s.id !== shopId));
        } catch (error) {
            console.error('Failed to delete shop:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="mx-auto flex max-w-[1000px] flex-col gap-2">
            <div className="mb-4 flex w-full flex-row items-center gap-2 max-md:flex-col">
                <>
                    <Typography
                        variant="h2"
                        className="text-2xl font-bold text-primary"
                    >
                        Shop Management
                    </Typography>

                    <Button
                        size="sm"
                        onClick={openCreateDialog}
                        className="ml-auto"
                        disabled={isLoading}
                    >
                        <span className="mr-2">
                            <Plus
                                color={
                                    isLoading ? 'rgb(203, 213, 225)' : '#fff'
                                }
                                size={16}
                                strokeWidth={3}
                            />
                        </span>
                        Create Shop
                    </Button>
                </>
            </div>

            {isLoading ? (
                // Skeleton loading state
                <>
                    <ShopSkeleton />
                    <ShopSkeleton />
                    <ShopSkeleton />
                </>
            ) : shops.length === 0 ? (
                <div className="flex items-center justify-center rounded-sm border p-8">
                    <Typography variant="body1" className="text-medium">
                        No shops found. Create one to get started!
                    </Typography>
                </div>
            ) : (
                shops.map((shop) => (
                    <div
                        className="flex items-center gap-2 rounded-sm border p-4 max-sm:flex-col"
                        key={shop.id}
                    >
                        <Typography variant="h3" className="font-bold">
                            {shop.name}
                        </Typography>
                        <Typography variant="body1" className="text-medium">
                            {shop.address}, {shop.province}, {shop.postalcode},{' '}
                            {shop.tel}
                        </Typography>

                        <div className="flex flex-row items-center gap-0 max-sm:w-full">
                            {Array.from({
                                length: shop.priceLevel,
                            }).map((_, index) => (
                                <CircleDollarSign
                                    key={index}
                                    color="#11aa11"
                                    size={20}
                                />
                            ))}
                        </div>
                        <Typography
                            variant="body1"
                            className="ml-auto text-medium"
                        >
                            <div className="ml-2 flex flex-row items-center gap-0">
                                <Button
                                    size="sm"
                                    className="bg-slate-400 hover:bg-slate-500"
                                    onClick={() => openEditDialog(shop)}
                                    disabled={isDeleting === shop.id}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => handleDelete(shop.id)}
                                    disabled={isDeleting === shop.id}
                                >
                                    {isDeleting === shop.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Delete'
                                    )}
                                </Button>
                            </div>
                        </Typography>
                    </div>
                ))
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Shop Name"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Shop Address"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priceLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price Level</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Province</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Province"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="postalcode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Postal Code"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Phone Number"
                                                type="number"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="picture"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Picture URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Picture URL"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {editMode
                                                ? 'Updating...'
                                                : 'Creating...'}
                                        </>
                                    ) : editMode ? (
                                        'Update Shop'
                                    ) : (
                                        'Create Shop'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ShopManagementPage;
