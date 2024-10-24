import { locale } from "$lib/locales/i18n";
import { DateTime, type DateTimeFormatOptions } from "luxon";
import { get } from "svelte/store";

const time_fmt: Record<string, DateTimeFormatOptions> = {
    default: DateTime.DATE_SHORT,
    abbrev: DateTime.DATE_MED,
    time_24: DateTime.TIME_24_SIMPLE
};

export function time_fmt_epoch_s(epoch_s: number | undefined, fmt_key: keyof typeof time_fmt = `default`): string {
    const dt = DateTime.fromSeconds(epoch_s);
    if (!dt.isValid) return ``;
    const time = dt.setLocale(get(locale)).toLocaleString(time_fmt[fmt_key]);
    return time;
};

export function time_iso(iso: string, fmt_key: keyof typeof time_fmt = `default`): string {
    const dt = DateTime.fromISO(iso);
    if (!dt.isValid) return ``;
    const time = dt.setLocale(get(locale)).toLocaleString(time_fmt[fmt_key]);
    return time;
};


export function time_iso_fmt(iso: string, fmt_str: string): string {
    const dt = DateTime.fromISO(iso);
    if (!dt.isValid) return ``;
    const time = dt.setLocale(get(locale)).toFormat(fmt_str);
    return time;
};

export function format_month_abbrev(month_num: number): string {
    if (month_num < 1 || month_num > 12) return ``;
    return DateTime.fromObject({ month: month_num }).setLocale(get(locale)).toFormat('MMM');
}