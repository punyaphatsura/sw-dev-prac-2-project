'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtomValue } from 'jotai';
import { Loader2, Plus } from 'lucide-react';
import * as z from 'zod';

import { userAtom } from '@/atom/user-atom';
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
import { Booking } from '@/common/interface/booking';
import { apiClient } from '@/libs/axiosConfig';

const BookingManagementPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [open, setOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const user = useAtomValue(userAtom);

    const formSchema = z.object({
        bookingDate: z
            .string()
            .nonempty('Booking date is required')
            .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
        serviceMinute: z
            .string()
            .refine((val) => ['60', '90', '120'].includes(val), {
                message: 'Service minute must be 60, 90, or 120',
            }),
        shopId: z.string(),
        userId: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bookingDate: '',
            serviceMinute: '60',
            shopId: '',
            userId: user?.id,
        },
    });

    useEffect(() => {
        form.setValue('userId', user?.id ?? '');
    }, [user]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await apiClient.get('/bookings');
                setBookings(response.data.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setError('Failed to load bookings. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            if (editingBooking) {
                await apiClient.put(`/bookings/${editingBooking._id}`, values);
                window.location.reload();
            } else {
                const response = await apiClient.post(
                    `/shops/${values.shopId}/bookings`,
                    {
                        ...values,
                        serviceMinute: Number(values.serviceMinute),
                        user: user?.id,
                    }
                );
                setBookings((prev) => [...prev, response.data]);
            }
            form.reset();
            setOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error submitting booking:', error);
            form.setError('userId', {
                type: 'manual',
                message: 'Cannot create booking, reservation is maximum at 3',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteBooking = async (id: string) => {
        try {
            await apiClient.delete(`/bookings/${id}`);
            setBookings((prev) => prev.filter((booking) => booking._id !== id));
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const startEdit = (booking: Booking) => {
        setEditingBooking(booking);
        form.setValue(
            'bookingDate',
            new Date(booking.bookingDate).toISOString().slice(0, 16)
        );
        form.setValue('serviceMinute', String(booking.serviceMinute));
        form.setValue('shopId', booking.shop.id);
        form.setValue('userId', booking.user);
        setOpen(true);
    };

    const BookingSkeleton = () => (
        <div className="flex items-center rounded-sm border p-4">
            <Skeleton className="h-6 w-2/3 rounded bg-gray-200" />
            <div className="ml-auto flex gap-2">
                <Skeleton className="h-8 w-16 rounded bg-gray-200" />
                <Skeleton className="h-8 w-16 rounded bg-gray-200" />
            </div>
        </div>
    );

    return (
        <>
            <div className="mx-auto flex max-w-[1000px] flex-col gap-2">
                <div className="mb-4 flex w-full flex-row items-center gap-2">
                    <Typography
                        variant="h2"
                        className="text-2xl font-bold text-primary"
                    >
                        Booking Management
                    </Typography>
                    <Button
                        size="sm"
                        onClick={() => {
                            setEditingBooking(null);
                            setOpen(true);
                        }}
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
                        Create Booking
                    </Button>
                </div>

                {isLoading ? (
                    <>
                        <BookingSkeleton />
                        <BookingSkeleton />
                        <BookingSkeleton />
                    </>
                ) : error ? (
                    <div className="w-full rounded-lg bg-red-50 p-4 text-center text-red-600">
                        {error}
                    </div>
                ) : bookings.length === 0 ? (
                    <Typography variant="h3" className="w-full text-center">
                        No bookings found
                    </Typography>
                ) : (
                    bookings.map((booking) => (
                        <div
                            className="flex items-center rounded-sm border p-4"
                            key={booking._id}
                        >
                            <Typography variant="h4">
                                {`Booking on ${new Date(booking.bookingDate)
                                    .toLocaleString(undefined, {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })
                                    .replace(
                                        /(\d{2})\/(\d{2})\/(\d{4})/,
                                        '$2/$1/$3'
                                    )} - ${booking.serviceMinute} mins`}
                            </Typography>
                            <div className="ml-auto flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => startEdit(booking)}
                                    className="bg-slate-400 hover:bg-slate-500"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteBooking(booking._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Dialog open={open} onOpenChange={() => setOpen(false)}>
                <DialogContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="bookingDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Booking Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
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
                                name="serviceMinute"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Service Duration (Minutes)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {!editingBooking && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="shopId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Shop ID</FormLabel>
                                                <FormControl>
                                                    <Input
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
                                        name="userId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>User ID</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditingBooking(null);
                                        setOpen(false);
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {editingBooking ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BookingManagementPage;
