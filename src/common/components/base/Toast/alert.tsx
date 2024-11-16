import {
    ComponentProps,
    PropsWithChildren,
    ReactNode,
    createContext,
    useContext,
    useState,
} from 'react';
import toast, { Toast, ToastOptions, resolveValue } from 'react-hot-toast';

import Button from '../Button';
import {
    faCircleCheck,
    faCircleExclamation,
    faCircleInfo,
    faClose,
    faSpinner,
    faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { ApiResponseType, ApiStatus } from '@/common/service/api/types';
import { cn } from '@/libs/utils';

const AlertContext = createContext<{ type: AlertType }>({ type: 'info' });
const useAlertContext = () => useContext(AlertContext);

export type AlertProps = AlertDisplayProps;
export const Alert = (props: AlertProps) => {
    const [closed, setClosed] = useState(false);
    if (closed) {
        return null;
    }
    return <AlertDisplay {...props} onClose={() => setClosed(true)} />;
};

type AlertDisplayProps = ComponentProps<'div'> & {
    type: AlertType;
    title: string;
    description?: ReactNode;
    onClose?: () => void;
    action?: ReactNode;
};
const AlertDisplay = ({ type, ...props }: AlertDisplayProps) => {
    const { className, title, description, onClose, action, ...rest } = props;
    return (
        <AlertContext.Provider value={{ type }}>
            <AlertContent className={className} {...rest}>
                <AlertIcon>
                    <FontAwesomeIcon icon={alertIcon[type]} />
                </AlertIcon>
                <AlertHeader onClose={onClose}>{title}</AlertHeader>
                {description && (
                    <AlertDescription>{description}</AlertDescription>
                )}
                {action}
            </AlertContent>
        </AlertContext.Provider>
    );
};
const alertIcon = {
    info: faCircleInfo,
    error: faCircleExclamation,
    success: faCircleCheck,
    warning: faTriangleExclamation,
    loading: faSpinner,
};

type AlertType = 'info' | 'error' | 'success' | 'warning' | 'loading';
type AlertToastMessage = string | AlertToastProps;

function createAlertToast(
    type: AlertType,
    message: AlertToastMessage,
    options?: ToastOptions
) {
    if (typeof message === 'string') {
        return toast.custom(
            (t) => <AlertToast type={type} t={t} title={message} />,
            options
        );
    } else {
        return toast.custom(
            (t) => (
                <AlertToast
                    type={type}
                    t={t}
                    title={message.title}
                    description={message.description}
                    action={message.action}
                />
            ),
            options
        );
    }
}
const infoAlertToast = (message: AlertToastMessage, options?: ToastOptions) =>
    createAlertToast('info', message, { duration: 4000, ...options });
const errorAlertToast = (message: AlertToastMessage, options?: ToastOptions) =>
    createAlertToast('error', message, { duration: 4000, ...options });
const successAlertToast = (
    message: AlertToastMessage,
    options?: ToastOptions
) => createAlertToast('success', message, { duration: 2000, ...options });
const warningAlertToast = (
    message: AlertToastMessage,
    options?: ToastOptions
) => createAlertToast('warning', message, { duration: 4000, ...options });
const loadingAlertToast = (
    message: AlertToastMessage,
    options?: ToastOptions
) => createAlertToast('loading', message, { duration: Infinity, ...options });

const promiseAlertToast = <T,>(
    promise: Promise<ApiResponseType<T>>,
    messages: {
        loading: AlertToastMessage;
        success: AlertToastMessage | ((data: T) => AlertToastMessage);
        error: AlertToastMessage | ((error: unknown) => AlertToastMessage);
    },
    options?: ToastOptions
): Promise<ApiResponseType<T>> => {
    const id = loadingAlertToast(messages.loading, options);
    promise.then((p) => {
        if (p.status === ApiStatus.SUCCESS) {
            successAlertToast(resolveValue(messages.success, p.data), {
                id,
                ...options,
            });
            return p;
        } else {
            errorAlertToast(resolveValue(messages.error, p.errorMessage), {
                id,
                ...options,
            });
        }
    });
    return promise;
};

export const alertToast = {
    info: infoAlertToast,
    error: errorAlertToast,
    success: successAlertToast,
    warning: warningAlertToast,
    loading: loadingAlertToast,
    promise: promiseAlertToast,
};

export interface AlertToastProps {
    title: string;
    description?: ReactNode;
    action?: ReactNode;
}
const AlertToast = (props: AlertToastProps & { type: AlertType; t: Toast }) => {
    const { type, t, ...rest } = props;
    return (
        <AlertDisplay
            type={type}
            {...t.ariaProps}
            data-state={t.visible ? 'open' : 'closed'}
            data-side={t.position?.includes('top') ? 'top' : 'bottom'}
            className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-bottom-2 data-[side=top]:slide-in-from-top-2 fill-mode-forwards light"
            onClose={() => toast.dismiss(t.id)}
            {...rest}
        />
    );
};

const alertBarStyles = cva(
    'w-2 absolute left-0 inset-y-0 rounded-l-lg transition-colors',
    {
        variants: {
            type: {
                info: 'bg-system-info',
                error: 'bg-system-error',
                success: 'bg-system-success',
                warning: 'bg-system-warning',
                loading: 'bg-system-info-light',
            },
        },
    }
);
const alertContentStyles = cva(
    'relative flex flex-col gap-1 p-4 pl-[57px] lg:pl-[70px] rounded-lg transition-colors min-w-[300px]',
    {
        variants: {
            type: {
                info: 'bg-white',
                error: 'bg-white',
                success: 'bg-white',
                warning: 'bg-white',
                loading: 'bg-white',
            },
        },
    }
);
export const AlertContent = ({
    className,
    children,
    ...rest
}: ComponentProps<'div'>) => {
    const { type } = useAlertContext();
    return (
        <div
            role="alert"
            className={cn(alertContentStyles({ type, className }))}
            {...rest}
        >
            <div className={alertBarStyles({ type })} />
            {children}
        </div>
    );
};

const alertIconStyles = cva(
    'absolute left-6 top-[calc(50%-12px)] text-[20px] lg:text-[24px] lg:top-[calc(50%-15px)] m-[2px] lg:m-[3px] fade-in zoom-in',
    {
        variants: {
            type: {
                info: 'text-system-info animate-in',
                error: 'text-system-error animate-in',
                success: 'text-system-success animate-in',
                warning: 'text-system-warning animate-in',
                loading: 'text-surface-container-highest animate-spin',
            },
        },
    }
);
export const AlertIcon = (props: PropsWithChildren) => {
    const { type } = useAlertContext();
    return <Slot className={alertIconStyles({ type })} {...props} />;
};

type AlertHeaderProps = PropsWithChildren<{
    onClose?: () => void;
}>;
export const AlertHeader = ({ children, onClose }: AlertHeaderProps) => {
    return (
        <div className="flex flex-1 items-center justify-between gap-4">
            <p className="text-body-medium-prominent lg:text-body-large-prominent text-text-on-surface">
                {children}
            </p>
            {onClose && (
                <Button
                    onClick={onClose}
                    variant="ghost"
                    color="black"
                    size="sm"
                    className="p-0"
                >
                    <FontAwesomeIcon icon={faClose} className="px-2" />
                </Button>
            )}
        </div>
    );
};
export const AlertDescription = ({ children }: PropsWithChildren) => {
    return (
        <div className="text-body-medium lg:text-body-large text-text-on-surface-variant font-regular whitespace-pre-line">
            {children}
        </div>
    );
};
