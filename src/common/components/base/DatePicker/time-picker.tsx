// Based on https://time.openstatus.dev
import React from 'react';

import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { cn } from '@/libs/utils';

import { getArrowByType, getDateByType, setDateByType } from './utils';

export interface TimePickerInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    picker: TimePickerType;
    date: Date | undefined;
    setDate: (date: Date | undefined) => boolean | void;
    onRightFocus?: () => void;
    onLeftFocus?: () => void;
}

export type TimePickerType = 'minutes' | 'seconds' | 'hours'; // | "12hours";

const TimePickerInput = React.forwardRef<
    HTMLInputElement,
    TimePickerInputProps
>(
    (
        {
            className,
            type = 'tel',
            value,
            id,
            name,
            date = new Date(new Date().setHours(0, 0, 0, 0)),
            setDate,
            onChange,
            onKeyDown,
            picker,
            onLeftFocus,
            onRightFocus,
            ...props
        },
        ref
    ) => {
        const [flag, setFlag] = React.useState<number>(0);

        /**
         * allow the user to enter the second digit within 2 seconds
         * otherwise start again with entering first digit
         */
        React.useEffect(() => {
            if (flag) {
                const timer = setTimeout(() => {
                    setFlag(0);
                }, 2000);

                return () => clearTimeout(timer);
            }
        }, [flag]);

        const calculatedValue = React.useMemo(
            () => getDateByType(date, picker),
            [date, picker]
        );

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Tab') return;
            e.preventDefault();
            if (e.key === 'ArrowRight') onRightFocus?.();
            if (e.key === 'ArrowLeft') onLeftFocus?.();
            if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
                const step = e.key === 'ArrowUp' ? 1 : -1;
                const newValue = getArrowByType(calculatedValue, step, picker);
                if (flag) setFlag(0);
                const tempDate = new Date(date);
                setDate(setDateByType(tempDate, newValue, picker));
            }
            if (e.key === 'Backspace') {
                const newValue = '0' + calculatedValue.slice(0, 1);
                const tempDate = new Date(date);
                if (flag) setFlag((prev) => (prev + 2) % 3);
                setDate(setDateByType(tempDate, newValue, picker));
            }
            if (e.key >= '0' && e.key <= '9') {
                if (flag >= 2) return;
                const newValue = !flag
                    ? '0' + e.key
                    : calculatedValue.slice(1, 2) + e.key;
                const tempDate = new Date(date);
                const result = setDate(
                    setDateByType(tempDate, newValue, picker)
                );

                if (!result) {
                    if (flag === 1) onRightFocus?.();
                    setFlag((prev) => (prev + 1) % 3);
                }
            }
        };

        return (
            <input
                ref={ref}
                id={id || picker}
                name={name || picker}
                className={cn(
                    'focus:text-text-on-surface w-[24px] text-center font-sans text-base tabular-nums caret-transparent outline-primary [&::-webkit-inner-spin-button]:appearance-none',
                    className
                )}
                value={value || calculatedValue}
                onChange={(e) => {
                    e.preventDefault();
                    onChange?.(e);
                }}
                type={type}
                inputMode="decimal"
                onKeyDown={(e) => {
                    onKeyDown?.(e);
                    handleKeyDown(e);
                }}
                {...props}
            />
        );
    }
);

TimePickerInput.displayName = 'TimePickerInput';

export { TimePickerInput };

interface TimePickerProps {
    date: Date | undefined;
    disabled?: boolean;
    setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, disabled, setDate }: TimePickerProps) {
    const minuteRef = React.useRef<HTMLInputElement>(null);
    const hourRef = React.useRef<HTMLInputElement>(null);
    const secondRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="focus-within:border-border-primary m-auto flex w-fit items-center gap-2 rounded-lg border p-2 px-4 text-center">
            <FontAwesomeIcon icon={faClock} />
            <TimePickerInput
                picker="hours"
                date={date}
                disabled={disabled}
                setDate={setDate}
                ref={hourRef}
                onRightFocus={() => minuteRef.current?.focus()}
            />
            <p className="text-base">:</p>
            <TimePickerInput
                picker="minutes"
                date={date}
                disabled={disabled}
                setDate={setDate}
                ref={minuteRef}
                onLeftFocus={() => hourRef.current?.focus()}
                onRightFocus={() => secondRef.current?.focus()}
            />
        </div>
    );
}
