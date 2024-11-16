'use client';

import { useSearchParams } from 'next/navigation';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import * as z from 'zod';

import { token } from '@/atom/token-atom';
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

const AuthForm = () => {
    const searchParam = useSearchParams();

    const [error, setError] = useState(searchParam.get('errorMessage'));
    const [tk, setTk] = useAtom(token);

    // const setUser = useSetAtom(userAtom);

    const formSchema = z.object({
        email: z.string().email('Please enter a valid email address'),
        password: z
            .string()
            .min(1, {
                message: 'Password enter a valid password',
            })
            .max(20, {
                message: 'Password must be at most 20 characters',
            }),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log('values', values);
        try {
            const response = await apiClient.post('/auth/login', {
                email: form.getValues('email'),
                password: form.getValues('password'),
            });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setTk(response.data.token);
                window.location.href = '/';
            } else {
                setError('Something went wrong please try again later');
            }
        } catch (e) {
            setError('Something went wrong please try again later');
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email" {...field} />
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
                                        placeholder="password"
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
                        <Button
                            type="submit"
                            className="min-w-[90px]"
                            onClick={async () => {
                                onSubmit(form.getValues());
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AuthForm;
