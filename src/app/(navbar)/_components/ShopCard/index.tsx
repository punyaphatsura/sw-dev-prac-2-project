'use client';

import Image from 'next/image';

import { useState } from 'react';

import { motion } from 'motion/react';

import { Dialog, DialogContent } from '@/common/components/base/Dialog/dialog';
import Typography from '@/common/components/base/Typography';
import { Shop } from '@/common/interface/shop';

interface ShopCardProps {
    imageUrl: string;
    id: string;
    shop: Shop;
}

const ShopCard = ({ imageUrl, id, shop }: ShopCardProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="h-[90vh] min-w-[90vw] outline-none">
                    <div className="flex flex-col items-center gap-2 px-4">
                        <motion.div
                            className="flex h-fit w-full max-w-[400px] overflow-hidden rounded-xl border bg-black"
                            layoutId={id}
                        >
                            <Image
                                src={imageUrl}
                                alt="logo"
                                className="flex w-full object-cover"
                                width={1000}
                                height={1000}
                            />
                        </motion.div>

                        <Typography variant="h3" className="font-semibold">
                            {shop.name}
                        </Typography>

                        <Typography
                            variant="body1"
                            className="w-[400px] max-w-[80vw]"
                        >
                            address: {shop.address}
                            <br />
                            province: {shop.province}
                            <br />
                            postal code: {shop.postalcode}
                            <br />
                            <div className="flex flex-row">
                                priceLevel:
                                <div className="ml-2 flex flex-row gap-0">
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
                            </div>
                        </Typography>
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
