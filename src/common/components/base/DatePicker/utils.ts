import { extendTailwindMerge } from 'tailwind-merge'

import { TimePickerType } from './time-picker'

// Based on https://time.openstatus.dev

export { clsx } from 'clsx'

/**
 * regular expression to check for valid hour format (01-23)
 */
export function isValidHour(value: string) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value)
}

/**
 * regular expression to check for valid 12 hour format (01-12)
 */
export function isValid12Hour(value: string) {
  return /^(0[1-9]|1[0-2])$/.test(value)
}

/**
 * regular expression to check for valid minute format (00-59)
 */
export function isValidMinuteOrSecond(value: string) {
  return /^[0-5][0-9]$/.test(value)
}

type GetValidNumberConfig = { max: number; min?: number; loop?: boolean }

export function getValidNumber(value: string, { max, min = 0, loop = false }: GetValidNumberConfig) {
  let numericValue = parseInt(value, 10)

  if (!isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max
      if (numericValue < min) numericValue = min
    } else {
      if (numericValue > max) numericValue = min
      if (numericValue < min) numericValue = max
    }
    return numericValue.toString().padStart(2, '0')
  }

  return '00'
}

export function getValidHour(value: string) {
  if (isValidHour(value)) return value
  return getValidNumber(value, { max: 23 })
}

export function getValid12Hour(value: string) {
  if (isValid12Hour(value)) return value
  return getValidNumber(value, { max: 12 })
}

export function getValidMinuteOrSecond(value: string) {
  if (isValidMinuteOrSecond(value)) return value
  return getValidNumber(value, { max: 59 })
}

type GetValidArrowNumberConfig = {
  min: number
  max: number
  step: number
}

export function getValidArrowNumber(value: string, { min, max, step }: GetValidArrowNumberConfig) {
  let numericValue = parseInt(value, 10)
  if (!isNaN(numericValue)) {
    numericValue += step
    return getValidNumber(String(numericValue), { min, max, loop: true })
  }
  return '00'
}

export function getValidArrowHour(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 23, step })
}

export function getValidArrowMinuteOrSecond(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 59, step })
}

export function setMinutes(date: Date, value: string) {
  const minutes = getValidMinuteOrSecond(value)
  date.setMinutes(parseInt(minutes, 10))
  return date
}

export function setSeconds(date: Date, value: string) {
  const seconds = getValidMinuteOrSecond(value)
  date.setSeconds(parseInt(seconds, 10))
  return date
}

export function setHours(date: Date, value: string) {
  const hours = getValidHour(value)
  date.setHours(parseInt(hours, 10))
  return date
}

export function setDateByType(date: Date, value: string, type: TimePickerType) {
  switch (type) {
    case 'minutes':
      return setMinutes(date, value)
    case 'seconds':
      return setSeconds(date, value)
    case 'hours':
      return setHours(date, value)
    default:
      return date
  }
}

export function getDateByType(date: Date, type: TimePickerType) {
  switch (type) {
    case 'minutes':
      return getValidMinuteOrSecond(String(date.getMinutes()))
    case 'seconds':
      return getValidMinuteOrSecond(String(date.getSeconds()))
    case 'hours':
      return getValidHour(String(date.getHours()))
    default:
      return '00'
  }
}

export function getArrowByType(value: string, step: number, type: TimePickerType) {
  switch (type) {
    case 'minutes':
      return getValidArrowMinuteOrSecond(value, step)
    case 'seconds':
      return getValidArrowMinuteOrSecond(value, step)
    case 'hours':
      return getValidArrowHour(value, step)
    default:
      return '00'
  }
}

export const cn = extendTailwindMerge({
  classGroups: {
    'text-color': [
      {
        text: [
          'text-white',
          'text-black',
          'text-on-surface',
          'text-on-surface-variant',
          'text-primary',
          'text-primary-fixed',
          'text-primary-hover',
          'text-primary-fixed-dim',
          'text-on-primary',
          'text-on-primary-fixed',
          'text-on-primary-fixed-variant',
          'text-on-primary-container',
          'text-secondary',
          'text-secondary-fixed',
          'text-secondary-hover',
          'text-secondary-fixed-dim',
          'text-on-secondary',
          'text-on-secondary-fixed',
          'text-on-secondary-fixed-variant',
          'text-on-secondary-container',
          'text-on-background',
          'text-on-background-variant',
          'text-on-white',
          'text-on-black',
          'text-disabled',
          'text-disabled-black-fixed',
          'text-placeholder',
        ],
      },
    ],
    'font-size': [
      {
        text: [
          'label-small',
          'label-small-prominent',
          'label-medium',
          'label-medium-prominent',
          'body-small',
          'body-small-prominent',
          'body-medium',
          'body-medium-prominent',
          'body-large',
          'body-large-prominent',
          'title-small',
          'title-small-prominent',
          'title-medium',
          'title-medium-prominent',
          'title-large',
          'title-large-prominent',
          'headline-small',
          'headline-medium',
          'headline-medium-prominent',
          'headline-large',
          'display-small',
          'display-small-prominent',
          'display-medium',
          'display-large',
        ],
      },
    ],
  },
})
