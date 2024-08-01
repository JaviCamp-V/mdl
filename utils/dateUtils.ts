import { fromZonedTime } from "date-fns-tz";

const daysBetween = (from: Date, to: Date): number => {
  const fromDate = new Date(from.getTime());
  const toDate = new Date(to.getTime());
  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(0, 0, 0, 0);
  const time = toDate.getTime() - fromDate.getTime();
  return Math.floor(time / (1000 * 3600 * 24));
};

const minusDays = (date: Date, days: number): Date => {
  const newDate = new Date(date.getTime());
  newDate.setDate(newDate.getDate() - days);
  return newDate;
};

const plusDays = (date: Date, days: number): Date => {
  const newDate = new Date(date.getTime());
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const minusYears = (date: Date, years: number): Date => {
  const newDate = new Date(date.getTime());
  newDate.setFullYear(newDate.getFullYear() - years);
  return newDate;
};

const plusYears = (date: Date, years: number): Date => {
  const newDate = new Date(date.getTime());
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
};

const minusMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date.getTime());
  newDate.setMonth(newDate.getMonth() - months);
  return newDate;
};

const plusMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date.getTime());
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

const createDate = (date: string, time: string, timezone: string): Date => {
    const dateTimeString = `${date}T${time}:00`;
    const zonedDate = fromZonedTime(dateTimeString, timezone);
    return zonedDate;
};
export { daysBetween, minusDays, plusDays, minusYears, plusYears, minusMonths, plusMonths, createDate };
