'use client';

import * as React from 'react';
import {
    DateAfter,
    DateBefore,
    DateInterval,
    DateRange,
    DayPickerRangeProps,
    DayPickerSingleProps,
} from 'react-day-picker';

import { Calendar, CalendarProps } from '../Calendar/calendar';
import { inputVariant } from '../Input/styled';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/popover';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import dayjs from 'dayjs';

import { cn } from '@/libs/utils';

import { TimePicker } from './time-picker';

interface DatePickerProps
    extends DatePickerContextValue,
        CommonCalendarProps,
        Omit<DatePickerTriggerProps, 'value' | 'onChange'> {}

function extractCalendarProps<TProps extends CommonCalendarProps>(
    props: TProps
) {
    const {
        disabledDate,
        timePicker: _,
        disabledFuture,
        lastNMonth,
        canUnselect,
        ...rest
    } = props;
    const calendarProps = {
        disabledDate,
        disabledFuture,
        lastNMonth,
        canUnselect,
    };
    return { calendarProps, rest };
}

export const DatePicker = React.forwardRef<
    React.ElementRef<typeof PopoverTrigger>,
    DatePickerProps
>(({ value, onChange, ...props }, ref) => {
    const { calendarProps, rest } = extractCalendarProps(props);
    return (
        <DatePickerProvider value={value} onChange={onChange}>
            <DatePickerTrigger ref={ref} {...rest} />
            <DatePickerCalendar {...calendarProps} />
        </DatePickerProvider>
    );
});
DatePicker.displayName = 'DatePicker';

export const DateTimePicker = React.forwardRef<
    React.ElementRef<typeof PopoverTrigger>,
    DatePickerProps
>(({ value, onChange, ...props }, ref) => {
    const { calendarProps, rest } = extractCalendarProps(props);
    return (
        <DatePickerProvider value={value} onChange={onChange}>
            <DateTimePickerTrigger ref={ref} {...rest} />
            <DateTimePickerCalendar {...calendarProps} />
        </DatePickerProvider>
    );
});
DateTimePicker.displayName = 'DateTimePicker';

interface DateRangePickerProps
    extends DateRangePickerContextValue,
        CommonCalendarProps,
        Omit<DatePickerTriggerProps, 'value' | 'onChange'> {}
export const DateRangePicker = React.forwardRef<
    React.ElementRef<typeof PopoverTrigger>,
    DateRangePickerProps
>(({ value, onChange, ...props }, ref) => {
    const { calendarProps, rest } = extractCalendarProps(props);
    return (
        <DateRangePickerProvider value={value} onChange={onChange}>
            <DateRangePickerTrigger ref={ref} {...rest} />
            <DateRangePickerCalendar {...calendarProps} />
        </DateRangePickerProvider>
    );
});
DateRangePicker.displayName = 'DateRangePicker';

interface DatePickerContextValue {
    value: Date | undefined;
    onChange: (data: Date | undefined, selectedDay: Date) => void;
}
const DatePickerContext = React.createContext(
    null as null | DatePickerContextValue
);
const useDatePickerContext = () => {
    const context = React.useContext(DatePickerContext);
    if (context === null) {
        throw new Error(
            'useDatePickerContext must be inside of DatePickerContext.Provider'
        );
    }
    return context;
};
interface DatePickerProviderProps extends DatePickerContextValue {
    children: React.ReactNode;
}
export const DatePickerProvider = ({
    children,
    ...props
}: DatePickerProviderProps) => {
    return (
        <DatePickerContext.Provider
            value={{ value: props.value, onChange: props.onChange }}
        >
            <Popover>{children}</Popover>
        </DatePickerContext.Provider>
    );
};

interface DateRangePickerContextValue {
    value: DateRange | undefined;
    onChange: (data: DateRange | undefined, selectedDay: Date) => void;
}
const DateRangePickerContext = React.createContext(
    null as null | DateRangePickerContextValue
);
const useDateRangePickerContext = () => {
    const context = React.useContext(DateRangePickerContext);
    if (context === null) {
        throw new Error(
            'useDateRangePickerContext must be inside of DateRangePickerContext.Provider'
        );
    }
    return context;
};
interface DateRangePickerProviderProps extends DateRangePickerContextValue {
    children: React.ReactNode;
}
export const DateRangePickerProvider = ({
    children,
    ...props
}: DateRangePickerProviderProps) => {
    return (
        <DateRangePickerContext.Provider value={props}>
            <Popover>{children}</Popover>
        </DateRangePickerContext.Provider>
    );
};

interface DatePickerValueProps {
    format?: string;
    placeholder?: string;
}
export const DatePickerValue = ({
    format = 'D MMMM BBBB',
    placeholder = 'select date',
}: DatePickerValueProps): React.ReactNode => {
    const { value: date } = useDatePickerContext();
    return (
        <div className="flex w-full flex-row items-center gap-2">
            <FontAwesomeIcon icon={faCalendar} className="flex" />
            {date ? dayjs(date).format(format) : <span>{placeholder}</span>}
        </div>
    );
};
export const DateRangePickerValue = ({
    format = 'D MMMM BBBB',
    placeholder = 'select date',
}: DatePickerValueProps) => {
    const { value: date } = useDateRangePickerContext();
    return (
        <>
            <FontAwesomeIcon icon={faCalendar} />
            {date?.from ? (
                date.to ? (
                    <>
                        {dayjs(date.from).isSame(date.to, 'day')
                            ? dayjs(date.from).format(format)
                            : `${dayjs(date.from).format(format)} - ${dayjs(date.to).format(format)}`}
                    </>
                ) : (
                    dayjs(date.from).format(format)
                )
            ) : (
                <span>{placeholder}</span>
            )}
        </>
    );
};

interface TriggerProps
    extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {}
const Trigger = React.forwardRef<
    React.ElementRef<typeof PopoverTrigger>,
    TriggerProps
>(({ className, children, ...props }, ref) => {
    return (
        <PopoverTrigger
            ref={ref}
            className={cn(
                inputVariant({
                    variantSize: 'sm',
                }),
                'data-[placeholder=true]:text-text-placeholder disabled:data-[placeholder=true]:text-text-disabled gap-2 text-[16px]',
                className
            )}
            {...props}
        >
            {children}
        </PopoverTrigger>
    );
});
interface DatePickerTriggerProps extends TriggerProps, DatePickerValueProps {}
export const DatePickerTrigger = React.forwardRef<
    React.ElementRef<typeof PopoverTrigger>,
    DatePickerTriggerProps
>(({ className, format, placeholder, ...props }, ref) => {
    const { value } = useDatePickerContext();
    return (
        <Trigger
            ref={ref}
            {...props}
            data-placeholder={!value}
            className={clsx('justify-between', className)}
        >
            <DatePickerValue format={format} placeholder={placeholder} />
        </Trigger>
    );
});
export const DateRangePickerTrigger = React.forwardRef<
    React.ElementRef<typeof PopoverTrigger>,
    DatePickerTriggerProps
>(({ format, placeholder, ...props }, ref) => {
    const { value: value } = useDateRangePickerContext();
    return (
        <Trigger ref={ref} {...props} data-placeholder={!value}>
            <DateRangePickerValue format={format} placeholder={placeholder} />
        </Trigger>
    );
});
export const DateTimePickerTrigger = React.forwardRef<
    React.ElementRef<typeof PopoverTrigger>,
    DatePickerTriggerProps
>(({ className, format = 'D MMMM BBBB HH:mm', placeholder, ...props }, ref) => {
    const { value } = useDatePickerContext();
    return (
        <Trigger
            ref={ref}
            {...props}
            data-placeholder={!value}
            className={clsx('justify-between', className)}
        >
            <DatePickerValue format={format} placeholder={placeholder} />
        </Trigger>
    );
});
export const DateTimeRangePickerTrigger = React.forwardRef<
    React.ElementRef<typeof PopoverTrigger>,
    DatePickerTriggerProps
>(({ format = 'D MMMM BBBB HH:mm', placeholder, ...props }, ref) => {
    const { value } = useDateRangePickerContext();
    return (
        <Trigger ref={ref} {...props} data-placeholder={!value}>
            <DateRangePickerValue format={format} placeholder={placeholder} />
        </Trigger>
    );
});

interface CommonCalendarProps {
    disabledDate?: CalendarProps['disabled'];
    timePicker?: React.ReactNode;
    // this will be overriden by `disabledDate` prop
    disabledFuture?: boolean;
    // this will be overriden by `disabledDate` prop
    lastNMonth?: number;
    canUnselect?: boolean;
}

export interface DatePickerCalendarProps
    extends Omit<DayPickerSingleProps, 'mode' | 'disabled'>,
        CommonCalendarProps {}

export interface DateRangePickerCalendarProps
    extends Omit<DayPickerRangeProps, 'mode' | 'disabled'>,
        CommonCalendarProps {}

export const DatePickerCalendar = (props: DatePickerCalendarProps) => {
    const { timePicker, disabledFuture, lastNMonth, canUnselect, ...rest } =
        props;
    const { value: date, onChange: setDate } = useDatePickerContext();

    const beforeDate =
        lastNMonth !== undefined
            ? dayjs()
                  .subtract(lastNMonth - 1, 'month')
                  .startOf('month')
                  .toDate()
            : undefined;
    const afterDate = disabledFuture ? new Date() : undefined;

    const disabledDate =
        rest.disabledDate ??
        ({
            before: beforeDate,
            after: afterDate,
        } as DateInterval);

    const onSelect: DayPickerSingleProps['onSelect'] = (date, selectedDay) => {
        if (!canUnselect && date === undefined) return;
        setDate(date, selectedDay);
    };
    return (
        <PopoverContent className="pointer-events-auto w-auto p-0">
            <Calendar
                mode="single"
                selected={date}
                onSelect={onSelect}
                defaultMonth={date}
                initialFocus
                disabled={disabledDate}
                {...rest}
            />
            {timePicker}
        </PopoverContent>
    );
};

export const DateRangePickerCalendar = (
    props: DateRangePickerCalendarProps
) => {
    const { timePicker, disabledFuture, lastNMonth, ...rest } = props;
    const { value: dateRange, onChange: setDateRange } =
        useDateRangePickerContext();

    const beforeDate =
        lastNMonth !== undefined
            ? dayjs()
                  .subtract(lastNMonth - 1, 'month')
                  .startOf('month')
                  .toDate()
            : undefined;
    const afterDate = disabledFuture ? new Date() : undefined;

    const disabledDate =
        rest.disabledDate ??
        ({
            before: beforeDate,
            after: afterDate,
        } as DateInterval | DateBefore | DateAfter);

    return (
        <PopoverContent className="mx-4 w-auto p-0" align="start">
            <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                defaultMonth={dateRange?.from}
                numberOfMonths={1}
                initialFocus
                disabled={disabledDate}
                {...rest}
            />
            {timePicker}
        </PopoverContent>
    );
};

export const DateTimePickerCalendar = (props: DatePickerCalendarProps) => {
    const disabledDate = props.disabledDate;
    const { value: date, onChange: setDate } = useDatePickerContext();
    return (
        <DatePickerCalendar
            {...props}
            onSelect={(_date, selectedDay) => {
                if (date) {
                    _date?.setHours(date.getHours());
                    _date?.setMinutes(date.getMinutes());
                    _date?.setSeconds(date.getSeconds());
                }

                setDate?.(_date, selectedDay);
            }}
            timePicker={
                <div className="border-border border-t p-3">
                    <TimePicker
                        setDate={(_date) => {
                            if (disabledDate instanceof Boolean && disabledDate)
                                return true;
                            if (
                                disabledDate instanceof Function &&
                                _date &&
                                disabledDate(_date)
                            )
                                return true;

                            setDate?.(_date, _date || new Date());
                        }}
                        date={date}
                    />
                </div>
            }
        />
    );
};

export const DateTimeRangePickerCalendar = (
    props: DateRangePickerCalendarProps
) => {
    const disabledDate = props.disabledDate;
    const { value: dateRange, onChange: setDateRange } =
        useDateRangePickerContext();
    return (
        <DateRangePickerCalendar
            {...props}
            onSelect={(_date, selectedDay) => {
                if (dateRange?.from) {
                    _date?.from?.setHours(dateRange.from.getHours());
                    _date?.from?.setMinutes(dateRange.from.getMinutes());
                    _date?.from?.setSeconds(dateRange.from.getSeconds());
                }

                if (dateRange?.to) {
                    _date?.to?.setHours(dateRange.to.getHours());
                    _date?.to?.setMinutes(dateRange.to.getMinutes());
                    _date?.to?.setSeconds(dateRange.to.getSeconds());
                }

                setDateRange(_date, selectedDay);
            }}
            numberOfMonths={2}
            timePicker={
                <div className="border-border flex items-center justify-around border-t p-3">
                    <TimePicker
                        setDate={(_date) => {
                            if (disabledDate instanceof Boolean && disabledDate)
                                return;
                            if (
                                disabledDate instanceof Function &&
                                _date &&
                                disabledDate(_date)
                            )
                                return;

                            let toDate = dateRange?.to;

                            if (toDate && _date && toDate < _date) {
                                toDate = new Date(_date);
                            }

                            setDateRange?.(
                                {
                                    from: _date,
                                    to: toDate,
                                },
                                _date || new Date()
                            );
                        }}
                        date={dateRange?.from}
                    />
                    <p className="text-base">-</p>
                    <TimePicker
                        setDate={(_date) => {
                            if (disabledDate instanceof Boolean && disabledDate)
                                return true;
                            if (
                                disabledDate instanceof Function &&
                                _date &&
                                disabledDate(_date)
                            )
                                return true;

                            let fromDate = dateRange?.from;

                            if (fromDate && _date && fromDate > _date) {
                                fromDate = new Date(_date);
                            }

                            setDateRange?.(
                                {
                                    from: fromDate,
                                    to: _date,
                                },
                                _date || new Date()
                            );
                        }}
                        date={dateRange?.to}
                    />
                </div>
            }
        />
    );
};
