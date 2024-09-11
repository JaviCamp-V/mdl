import { addHours, format, formatDistance, intervalToDuration, parse } from 'date-fns';
import Values from '@/types/common/Values';

/**
 *
 * @param date
 * @returns date in the format 'YYYY-MM-DD'
 */
const formatDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString().split('T')[0];
};

const formatStringDate = (date: any): Date => {
  if (!date) return new Date();
  if (date instanceof Date) return date;
  return new Date(date?.split('T')[0].replace(/-/g, '/'));
};
const formatShortDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  return format(date, 'MMM dd, yyyy');
};

const formatTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const formatDateToDistance = (date: string): string => {
  try {
    const trimmedDate = date.substring(0, 23);
    const formatString = "yyyy-MM-dd'T'HH:mm:ss.SSS";
    const formattedDate = parse(trimmedDate, formatString, new Date());
    // account for api time difference
    return formatDistance(formattedDate, addHours(new Date(), 5), { addSuffix: true });
  } catch (error) {
    return '';
  }
};

const formatDigitsWithPadding = (num: number, digits: number): string => num.toString().padStart(digits, '0');

const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0 ? `${hours} hr. ${remainingMinutes} mins` : `${remainingMinutes} mins`;
};

const formDataToValues = (formData: FormData): Values => {
  const values: Values = {};
  formData.forEach((value, key) => {
    values[key] = value;
  });
  return values;
};
const valuesToFormData = (values: Values): FormData => {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};

const formatTimeInMinutes = (minutes: number): string => {
  const duration = intervalToDuration({ start: 0, end: minutes * 60 * 1000 });
  const years = duration.years ? `${duration.years}y ` : '';
  const months = duration.months ? `${duration.months}mo ` : '';
  const days = duration.days ? `${duration.days}d ` : '';
  const hours = duration.hours ? `${duration.hours}h ` : '';
  const mins = duration.minutes ? `${duration.minutes}m` : '';
  return `${years}${months}${days}${hours}${mins}`.trim() || '0m';
};

export {
  formatDate,
  formatTime,
  formatDigitsWithPadding,
  formatRuntime,
  formatShortDate,
  formatStringDate,
  formatDateToDistance,
  formDataToValues,
  valuesToFormData,
  formatTimeInMinutes
};
