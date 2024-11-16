'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtomValue } from 'jotai';
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
import Typography from '@/common/components/base/Typography';
import { Booking } from '@/common/interface/booking';
import { apiClient } from '@/libs/axiosConfig';

const BookingManagementPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [open, setOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

    const user = useAtomValue(userAtom);

    const formSchema = z.object({
        bookingDate: z
            .string()
            .nonempty('Booking date is required')
            .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
        // must be 60 90 120
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

    // Fetch all bookings on component mount
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await apiClient.get('/bookings');
                setBookings(response.data.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
        fetchBookings();
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log('values', values);
        try {
            if (editingBooking) {
                console.log('PUT');
                console.log('editingBooking', editingBooking);
                // Update existing booking
                await apiClient.put(`/bookings/${editingBooking._id}`, values);

                window.location.reload();
            } else {
                // Create new booking
                const response = await apiClient.post(
                    `/shops/${values.shopId}/bookings`,
                    {
                        ...values,
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
        console.log(booking.bookingDate);
        form.setValue(
            'bookingDate',
            new Date(booking.bookingDate).toISOString().slice(0, 16)
        );
        form.setValue('serviceMinute', String(booking.serviceMinute));
        form.setValue('shopId', booking.shop.id);
        form.setValue('userId', booking.user);
        setOpen(true);
    };

    console.log('form', form.getValues());

    return (
        <div className="mx-auto flex max-w-[1000px] flex-col gap-2">
            <div className="flex w-full flex-row items-center gap-2">
                <Typography variant="h2">Booking Management</Typography>
                <Button
                    size="sm"
                    onClick={() => {
                        setEditingBooking(null);
                        setOpen(true);
                    }}
                >
                    + Create Booking
                </Button>
            </div>

            {bookings.filter(
                (booking) => booking.user === user?.id || user?.role == 'admin'
            ).length === 0 && (
                <Typography variant="h3" className="w-full text-center">
                    No bookings found
                </Typography>
            )}

            {bookings
                .filter(
                    (booking) =>
                        booking.user === user?.id || user?.role == 'admin'
                )
                .map((booking) => (
                    <div
                        className="flex rounded-sm border p-4"
                        key={booking._id}
                    >
                        <Typography variant="h3">
                            {`Booking on ${new Date(
                                booking.bookingDate
                            ).toLocaleString()} - ${booking.serviceMinute} mins`}
                        </Typography>
                        <div className="ml-auto flex gap-2">
                            <Button
                                size="sm"
                                onClick={() => startEdit(booking)}
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
                ))}

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
                                                type="datetime-local"
                                                {...field}
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
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {!editingBooking && (
                                <FormField
                                    control={form.control}
                                    name="shopId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Shop ID</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {!editingBooking && (
                                <FormField
                                    control={form.control}
                                    name="userId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>User ID</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditingBooking(null);
                                        setOpen(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingBooking ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BookingManagementPage;
