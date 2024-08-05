import { format } from 'date-fns';

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

const formatDigitsWithPadding = (num: number, digits: number): string => num.toString().padStart(digits, '0');

const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0 ? `${hours} hr. ${remainingMinutes} mins` : `${remainingMinutes} mins`;
};
export { formatDate, formatTime, formatDigitsWithPadding, formatRuntime, formatShortDate, formatStringDate };
