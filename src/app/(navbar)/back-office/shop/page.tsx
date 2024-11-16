'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
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
import Typography from '@/common/components/base/Typography';
import { Shop } from '@/common/interface/shop';
import { apiClient } from '@/libs/axiosConfig';

const ShopManagementPage = () => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentShop, setCurrentShop] = useState<Shop | null>(null);

    useEffect(() => {
        // Fetch shop data
        const fetchData = async () => {
            const response = await apiClient.get('/shops');
            setShops(response.data.data);
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
    };

    return (
        <div className="mx-auto flex max-w-[1000px] flex-col gap-2">
            <div className="flex w-full flex-row items-center gap-2 max-md:flex-col">
                <Typography variant="h2">Shop Management</Typography>

                <Button size="sm" onClick={openCreateDialog}>
                    + Create Shop
                </Button>
            </div>

            {shops.map((shop) => (
                <div
                    className="flex gap-2 rounded-sm border p-4 max-lg:flex-col"
                    key={shop.id}
                >
                    <Typography variant="h3">{shop.name}</Typography>
                    <Typography variant="body1" className="text-medium">
                        {shop.address}
                    </Typography>
                    <Typography variant="body1" className="text-medium">
                        {shop.province}
                    </Typography>
                    <Typography variant="body1" className="text-medium">
                        {shop.postalcode}
                    </Typography>
                    <Typography variant="body1" className="text-medium">
                        {shop.tel}
                    </Typography>

                    <div className="flex flex-row items-center gap-0">
                        {Array.from({
                            length: shop.priceLevel,
                        }).map((_, index) => (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 50 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                key={shop.id + ' ' + index}
                            >
                                <path
                                    d="M23.0629 5.49809C23.6416 4.19964 23.9311 3.55041 24.3341 3.35049C24.6841 3.17679 25.0951 3.17679 25.4451 3.35049C25.8481 3.55041 26.1376 4.19964 26.7164 5.49809L31.3264 15.8404C31.4976 16.2243 31.5831 16.4162 31.7156 16.5632C31.8326 16.6932 31.9759 16.7972 32.1356 16.8684C32.3164 16.9489 32.5254 16.971 32.9434 17.0151L44.2041 18.2036C45.6179 18.3528 46.3246 18.4274 46.6394 18.7489C46.9126 19.0281 47.0396 19.4191 46.9826 19.8057C46.9171 20.2507 46.3891 20.7265 45.3331 21.6782L36.9214 29.2587C36.6094 29.54 36.4531 29.6807 36.3544 29.852C36.2669 30.0037 36.2121 30.172 36.1939 30.346C36.1731 30.5427 36.2166 30.7482 36.3039 31.1595L38.6534 42.2362C38.9484 43.627 39.0959 44.3222 38.8874 44.7207C38.7061 45.0672 38.3736 45.3087 37.9884 45.374C37.5449 45.449 36.9291 45.094 35.6976 44.3837L25.8889 38.7262C25.5249 38.5162 25.3429 38.4115 25.1494 38.3702C24.9781 38.334 24.8011 38.334 24.6299 38.3702C24.4364 38.4115 24.2544 38.5162 23.8904 38.7262L14.0817 44.3837C12.8502 45.094 12.2345 45.449 11.791 45.374C11.4057 45.3087 11.0731 45.0672 10.892 44.7207C10.6835 44.3222 10.831 43.627 11.126 42.2362L13.4754 31.1595C13.5626 30.7482 13.6062 30.5427 13.5855 30.346C13.5672 30.172 13.5125 30.0037 13.425 29.852C13.3261 29.6807 13.17 29.54 12.8578 29.2587L4.44629 21.6782C3.39026 20.7265 2.86224 20.2507 2.79659 19.8057C2.73959 19.4191 2.86661 19.0281 3.13996 18.7489C3.45466 18.4274 4.16154 18.3528 5.57529 18.2036L16.836 17.0151C17.254 16.971 17.4629 16.9489 17.6436 16.8684C17.8035 16.7972 17.9466 16.6932 18.0638 16.5632C18.1962 16.4162 18.2817 16.2243 18.4528 15.8404L23.0629 5.49809Z"
                                    fill="#EBCF00"
                                    stroke="#EBCF00"
                                    stroke-width="5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        ))}
                    </div>
                    <Typography variant="body1" className="text-medium ml-auto">
                        <div className="ml-2 flex flex-row items-center gap-0">
                            <Button
                                size="sm"
                                onClick={() => openEditDialog(shop)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="ml-2"
                                onClick={async () => {
                                    await apiClient.delete(`/shops/${shop.id}`);
                                    setShops((prev) =>
                                        prev.filter((s) => s.id !== shop.id)
                                    );
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </Typography>
                </div>
            ))}

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
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editMode ? 'Update Shop' : 'Create Shop'}
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
