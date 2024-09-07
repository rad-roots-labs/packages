import { DateTime, type DateTimeFormatOptions } from "luxon";

const time_fmt: Record<string, DateTimeFormatOptions> = {
    default: DateTime.DATE_SHORT,
    abbrev: DateTime.DATE_MED
};

export function time_fmt_epoch_s(locale: string, epoch_s: number | undefined, fmt_key: keyof typeof time_fmt = `default`): string {
    const dt = DateTime.fromSeconds(epoch_s);
    if (!dt.isValid) return ``;
    const time = dt.setLocale(locale).toLocaleString(time_fmt[fmt_key]);
    return time;
};

export function time_fmt_iso(locale: string, iso: string, fmt_key: keyof typeof time_fmt = `default`): string {
    const dt = DateTime.fromISO(iso);
    if (!dt.isValid) return ``;
    const time = dt.setLocale(locale).toLocaleString(time_fmt[fmt_key]);
    return time;
};