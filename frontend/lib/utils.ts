import { type ClassValue, clsx } from "clsx";
import { useFormatter } from "next-intl";
import { twMerge } from "tailwind-merge";
import { DateTimeFormatOptions, useTimeZone } from "use-intl";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function FormatDate(
  date: string,
  style: string | DateTimeFormatOptions | undefined = {
    dateStyle: "long",
  } as DateTimeFormatOptions,
) {
  const format = useFormatter();
  return date && format.dateTime(convertTimeToUTC(date), style);
}
export function FormatDateTime(
  date: string,
  style: string | DateTimeFormatOptions | undefined = {
    dateStyle: "medium",
    timeStyle: "short",
  } as DateTimeFormatOptions,
) {
  const format = useFormatter();
  return date && format.dateTime(convertTimeToUTC(date), style);
}
// changes time to utc
export function convertTimeToUTC(date: string) {
  const serverDate = new Date(date);
  const hours = Number(process.env.NEXT_PUBLIC_CALLIBRATE_HOURS);
  serverDate.setHours(serverDate.getHours() + hours); // 5 is the offset from UTC on AWS
  return serverDate;
}
