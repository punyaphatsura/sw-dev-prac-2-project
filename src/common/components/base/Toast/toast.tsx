'use client';

import toast, {
    Toaster as ReactHotToaster,
    ToastBar,
    ToasterProps,
} from 'react-hot-toast';

import Button from '../Button';
import {
    faCircleCheck,
    faCircleInfo,
    faCircleXmark,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { cn } from '@/libs/utils';

export { alertToast as toast } from './alert';
export { toast as reactHotToast } from 'react-hot-toast';

// Toaster use goober to style the toast by default, and goober was injected AFTER tailwind
// Such that goober has always higher priority than tailwind
// For workaround, we can use !important to override the style
const baseContainerClassName = cn(
    '!w-fit !min-w-[200px] !max-w-[600px] !bg-gray-50 !text-gray-950 !shadow-lg !transition-colors !duration-300'
);
const baseIconClassName = cn('animate-in zoom-in duration-300 ease-in-out');

export const Toaster = ({ position, ...props }: ToasterProps) => {
    return (
        <ReactHotToaster
            position={position}
            toastOptions={{
                className: baseContainerClassName,
                error: {
                    className: cn(
                        baseContainerClassName,
                        '!bg-red-400 !text-red-950'
                    ),
                    icon: (
                        <FontAwesomeIcon
                            icon={faCircleXmark}
                            className={cn(baseIconClassName, '!text-red-950')}
                        />
                    ),
                },
                success: {
                    className: cn(
                        baseContainerClassName,
                        '!bg-green-400 !text-green-950'
                    ),
                    icon: (
                        <FontAwesomeIcon
                            icon={faCircleCheck}
                            className={cn(baseIconClassName, '!text-green-950')}
                        />
                    ),
                },
            }}
            {...props}
        >
            {(t) => (
                <ToastBar toast={t} position={position}>
                    {({ icon, message }) => (
                        <>
                            {t.type !== 'blank' && icon}
                            {t.type === 'blank' && (
                                <FontAwesomeIcon
                                    icon={faCircleInfo}
                                    className={cn(
                                        baseIconClassName,
                                        '!text-gray-950'
                                    )}
                                />
                            )}
                            <div className="!w-full [&>*]:!justify-start">
                                {message}
                            </div>
                            {t.type !== 'loading' && (
                                <Button
                                    aria-label="Close Toast"
                                    variant="ghost"
                                    onClick={() => toast.dismiss(t.id)}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </Button>
                            )}
                        </>
                    )}
                </ToastBar>
            )}
        </ReactHotToaster>
    );
};
