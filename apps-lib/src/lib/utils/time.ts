import { DateTime } from "luxon";

export function time_fmt_nostr_event(locale: string, epoch_s?: number): string {
    const dt = DateTime.fromSeconds(epoch_s);
    if (!dt.isValid) return ``;
    const time = dt.setLocale(locale).toLocaleString(DateTime.DATETIME_MED)
    return time;
};