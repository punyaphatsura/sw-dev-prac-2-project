'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Button from '@/common/components/base/Button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/common/components/base/Form/form';
import Input from '@/common/components/base/Input';
import { apiClient } from '@/libs/axiosConfig';

const RegisterAuthForm = () => {
    const searchParam = useSearchParams();
    const { push } = useRouter();

    const [error, setError] = useState(searchParam.get('errorMessage'));

    const formSchema = z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        phone: z
            .string()
            .min(10, { message: 'Phone number must be at least 10 digits' })
            .max(15, { message: 'Phone number must be at most 15 digits' })
            .regex(/^\d+$/, {
                message: 'Phone number must contain only digits',
            }),
        email: z.string().email('Please enter a valid email address'),
        password: z
            .string()
            .min(6, {
                message: 'Password must be at least 6 characters',
            })
            .max(20, {
                message: 'Password must be at most 20 characters',
            }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log('values', values);
        try {
            const response = await apiClient.post('/auth/register', {
                name: values.name,
                email: values.email,
                tel: values.phone,
                role: 'user',
                password: values.password,
                createdAt: new Date().toISOString(),
            });
            if (response.data.success) {
                push('/auth');
            }
        } catch (e) {
            setError('Something went wrong, please try again later');
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col gap-[15px]">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-[15px]"
                    method="post"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Phone"
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {error && <FormMessage>*{error}</FormMessage>}
                    <div className="flex flex-row">
                        <div className="w-full" />
                        <Button type="submit" className="min-w-[90px]">
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default RegisterAuthForm;
