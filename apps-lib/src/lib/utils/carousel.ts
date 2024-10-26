import {
    carousel_active,
    carousel_index,
    carousel_index_max,
    carousel_num,
    exe_iter
} from "$lib";
import { get as get_store } from 'svelte/store';

const CAROUSEL_DELAY_MS = 250;

const get_slide_container = <T extends string>(
    view: T,
): Element | undefined => {
    const el = document.querySelector(
        `[data-carousel-container="${view}"]`,
    );
    return el ? el : undefined;
};

const get_slide_item = <T extends string>(view: T): Element | undefined => {
    const el = document.querySelector(`[data-carousel-item="${view}"]`);
    return el ? el : undefined;
};

const carousel_dec_handler = async <T extends string>(
    view: T,
): Promise<void> => {
    if (get_store(carousel_active)) return;
    carousel_active.set(true);
    const slide_item = get_slide_item<T>(view);
    const slide_container = get_slide_container<T>(view);
    if (slide_container && slide_item) {
        const slide_w = slide_item?.clientWidth || 0;
        slide_container.scrollLeft -= slide_w;
        carousel_index.set(Math.max(get_store(carousel_index) - 1, 0));
    }
    carousel_active.set(false);
};

const carousel_inc_handler = async <T extends string>(
    view: T,
): Promise<void> => {
    if (get_store(carousel_active)) return;
    carousel_active.set(true);
    const slide_item = get_slide_item<T>(view);
    const slide_container = get_slide_container<T>(view);
    if (slide_container && slide_item) {
        const slide_w = slide_item?.clientWidth || 0;
        slide_container.scrollLeft += slide_w;
        carousel_index.set(
            Math.min(get_store(carousel_index) + 1, get_store(carousel_index_max)),
        );
    }
    carousel_active.set(false);
};

export const carousel_inc = async <T extends string>(
    view: T,
    duration: number = CAROUSEL_DELAY_MS
): Promise<void> => {
    const num = get_store(carousel_num) || 1;
    carousel_num.set(1);
    await exe_iter(async () => carousel_inc_handler(view), num, duration);
};


export const carousel_dec = async <T extends string>(
    view: T,
    duration: number = CAROUSEL_DELAY_MS
): Promise<void> => {
    const num = get_store(carousel_num) || 1;
    carousel_num.set(1);
    await exe_iter(async () => carousel_dec_handler(view), num, duration);
};
