import { DateTime } from "luxon";

export function time_fmt_nostr_event(locale: string, epoch_s?: number): string {
    const dt = DateTime.fromSeconds(epoch_s);
    if (!dt.isValid) return ``;
    const time = dt.setLocale(locale).toLocaleString(DateTime.DATETIME_MED)
    return time;
};

export function time_fmt_db_iso(locale: string, iso?: string): string {
    const dt = DateTime.fromISO(iso);
    if (!dt.isValid) return ``;
    const time = dt.setLocale(locale).toLocaleString(DateTime.DATETIME_MED)
    return time;
};