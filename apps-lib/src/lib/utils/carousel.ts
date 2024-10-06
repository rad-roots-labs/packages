import {
    carousel_active,
    carousel_index,
    carousel_index_max,
    sleep
} from "$lib";
import { get as get_store } from 'svelte/store';

const SLIDE_DURATION_MS = 400;

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

export const carousel_prev = async <T extends string>(
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
    await sleep(SLIDE_DURATION_MS);
    carousel_active.set(false);
};

export const carousel_next = async <T extends string>(
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
    await sleep(SLIDE_DURATION_MS);
    carousel_active.set(false);
};
