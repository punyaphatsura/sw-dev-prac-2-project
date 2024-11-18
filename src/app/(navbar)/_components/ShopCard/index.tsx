'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleDollarSign, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { z } from 'zod';

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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/common/components/base/Select';
import Typography from '@/common/components/base/Typography';
import { Shop } from '@/common/interface/shop';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/libs/axiosConfig';

interface ShopCardProps {
    imageUrl: string;
    id: string;
    shop: Shop;
}

const ShopCard = ({ imageUrl, id, shop }: ShopCardProps) => {
    const [open, setOpen] = useState(false);
    const [showBookForm, setShowBookForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState('');

    const { toast } = useToast();

    const { push } = useRouter();

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
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log('values', values);
        setIsSubmitting(true);
        try {
            // Create new booking
            await apiClient.post(`/shops/${values.shopId}/bookings`, {
                bookingDate: values.bookingDate,
                serviceMinute: Number(values.serviceMinute),
                createdAt: new Date().toISOString(),
            });

            form.reset();
            setOpen(false);
            toast({
                variant: 'success',
                title: 'Booking success',
            });
            push('/back-office/booking');
        } catch (err: any) {
            if (
                (err.response.data.message as string).includes(
                    'has already made 3 bookings'
                )
            ) {
                setError('You have already made 3 bookings');
                toast({
                    variant: 'destructive',
                    title: 'Booking failed',
                    description: 'You have already made 3 bookings',
                });
                return;
            }
            toast({
                variant: 'destructive',
                title: 'Booking failed',
                description: 'Try again later',
            });
            setError('Something went wrong creating booking');
        } finally {
            setIsSubmitting(false);
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bookingDate: '',
            serviceMinute: '60',
            shopId: shop.id,
        },
    });

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="h-[90vh] min-w-[90vw] overflow-hidden py-0 outline-none">
                    <div className="h-full overflow-y-scroll pb-2 pt-12">
                        <div className="flex flex-1 flex-col items-center gap-2 gap-y-8 px-4">
                            <motion.div
                                className="flex max-h-[300px] w-full max-w-[400px] overflow-hidden rounded-xl border bg-black"
                                layoutId={id}
                            >
                                <Image
                                    src={imageUrl}
                                    alt="logo"
                                    className="w-full object-cover"
                                    width={1000}
                                    height={1000}
                                />
                            </motion.div>

                            <Typography
                                variant="h3"
                                className="mb-2 text-2xl font-semibold"
                            >
                                {shop.name}
                            </Typography>

                            <div className="flex w-[300px] max-w-[80vw] flex-col gap-y-2">
                                <Typography variant="body1">
                                    <span className="font-bold">Address:</span>{' '}
                                    {shop.address}
                                </Typography>
                                <Typography variant="body1">
                                    <span className="font-bold">Province:</span>{' '}
                                    {shop.province}
                                </Typography>
                                <Typography variant="body1">
                                    <span className="font-bold">
                                        Postal code:
                                    </span>{' '}
                                    {shop.postalcode}
                                </Typography>
                                <div className="flex flex-row">
                                    <span className="font-bold">Price:</span>
                                    <div className="ml-2 flex flex-row gap-0">
                                        {Array.from({
                                            length: shop.priceLevel,
                                        }).map((_, idx) => (
                                            <CircleDollarSign
                                                key={idx}
                                                color="#11aa11"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {showBookForm ? (
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
                                                    <FormLabel>
                                                        Booking Date
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
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
                                                        Service Duration
                                                        (Minutes)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            {...field}
                                                            onValueChange={(
                                                                e
                                                            ) => {
                                                                field.onChange(
                                                                    e
                                                                );
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select a fruit" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white">
                                                                <SelectGroup>
                                                                    <SelectItem
                                                                        value="60"
                                                                        className="transition-colors hover:bg-slate-100"
                                                                    >
                                                                        60
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="90"
                                                                        className="transition-colors hover:bg-slate-100"
                                                                    >
                                                                        90
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="120"
                                                                        className="transition-colors hover:bg-slate-100"
                                                                    >
                                                                        120
                                                                    </SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {error !== '' && (
                                            <Typography className="text-right text-sm text-system-error">
                                                {error}
                                            </Typography>
                                        )}
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting && (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                )}
                                                Book
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            ) : (
                                <Button
                                    className="w-full max-w-[400px]"
                                    onClick={() => {
                                        setShowBookForm(true);
                                    }}
                                >
                                    Book this shop
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <motion.div
                className="flex h-fit w-full cursor-pointer overflow-hidden rounded-xl bg-black"
                onClick={() => setOpen(true)}
                layoutId={id}
            >
                <motion.div
                    whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.2 },
                        opacity: 0.7,
                    }}
                    animate={{
                        scale: 1.01,
                        transition: { duration: 0.2 },
                        opacity: 1,
                    }}
                >
                    <Image
                        src={imageUrl}
                        alt="logo"
                        className="flex w-full object-cover"
                        width={1000}
                        height={1000}
                    />
                </motion.div>
            </motion.div>
        </>
    );
};

export default ShopCard;
