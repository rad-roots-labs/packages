import { get_store, liblocale, type GeolocationLatitudeFmtOption } from "$lib";

export const geol_lat_fmt = (lat: number, fmt_opt: GeolocationLatitudeFmtOption, precision: number = 5): string => {
    const $locale = get_store(liblocale)
    const options: Intl.NumberFormatOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    const fmt_deg = new Intl.NumberFormat($locale, { maximumFractionDigits: 0 });
    const fmt_min = new Intl.NumberFormat($locale, options);
    const fmt_sec = new Intl.NumberFormat($locale, options);
    if (fmt_opt === 'dms') {
        const deg = Math.floor(Math.abs(lat));
        const min = Math.floor((Math.abs(lat) - deg) * 60);
        const sec = ((Math.abs(lat) - deg - min / 60) * 3600);
        return `${fmt_deg.format(deg)}° ${fmt_min.format(min)}' ${fmt_sec.format(sec)}" ${lat >= 0 ? 'N' : 'S'}`;
    } else if (fmt_opt === 'dm') {
        const deg = Math.floor(Math.abs(lat));
        const min = (Math.abs(lat) - deg) * 60;
        return `${fmt_deg.format(deg)}° ${fmt_min.format(min)}' ${lat >= 0 ? 'N' : 'S'}`;
    } else {
        return `${lat.toLocaleString($locale, { maximumFractionDigits: precision })}° ${lat >= 0 ? 'N' : 'S'}`;
    }
};

export const geol_lng_fmt = (lng: number, fmt_opt: GeolocationLatitudeFmtOption, precision: number = 5): string => {
    const $locale = get_store(liblocale)
    const options: Intl.NumberFormatOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    const fmt_deg = new Intl.NumberFormat($locale, { maximumFractionDigits: 0 });
    const fmt_min = new Intl.NumberFormat($locale, options);
    const fmt_sec = new Intl.NumberFormat($locale, options);
    if (fmt_opt === 'dms') {
        const degrees = Math.floor(Math.abs(lng));
        const minutes = Math.floor((Math.abs(lng) - degrees) * 60);
        const seconds = ((Math.abs(lng) - degrees - minutes / 60) * 3600);
        return `${fmt_deg.format(degrees)}° ${fmt_min.format(minutes)}' ${fmt_sec.format(seconds)}" ${lng >= 0 ? 'E' : 'W'}`;
    } else if (fmt_opt === 'dm') {
        const degrees = Math.floor(Math.abs(lng));
        const minutes = (Math.abs(lng) - degrees) * 60;
        return `${fmt_deg.format(degrees)}° ${fmt_min.format(minutes)}' ${lng >= 0 ? 'E' : 'W'}`;
    } else {
        return `${lng.toLocaleString($locale, { maximumFractionDigits: precision })}° ${lng >= 0 ? 'E' : 'W'}`;
    }
};