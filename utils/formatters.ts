
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
}

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
}

const formatDigitsWithPadding = (num: number, digits: number): string => num.toString().padStart(digits, '0');


export { formatDate, formatTime, formatDigitsWithPadding };