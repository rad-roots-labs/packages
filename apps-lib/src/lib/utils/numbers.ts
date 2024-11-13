import { locale } from "$lib/locales/i18n";
import { get as get_store } from "svelte/store";

export const fmt_price = (currency: string, value: string): string => {
    const value_num = parseFloat(value);
    const res = new Intl.NumberFormat(get_store(locale), {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value_num);
    return res;
};
