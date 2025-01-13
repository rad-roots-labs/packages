import {
    carousel_active,
    carousel_index,
    carousel_index_max,
    carousel_num,
    exe_iter,
    get_store
} from "$lib";
const CAROUSEL_DELAY_MS = 150;

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
    const $carousel_active = get_store(carousel_active);
    if ($carousel_active) return;
    carousel_active.set(true);
    const slide_item = get_slide_item<T>(view);
    const slide_container = get_slide_container<T>(view);
    if (slide_container && slide_item) {
        const slide_w = slide_item?.clientWidth || 0;
        slide_container.scrollLeft -= slide_w;
        const $carousel_index = get_store(carousel_index);
        carousel_index.set(Math.max($carousel_index - 1, 0));
    }
    carousel_active.set(false);
};

const carousel_inc_handler = async <T extends string>(
    view: T,
): Promise<void> => {
    const $carousel_active = get_store(carousel_active);
    if ($carousel_active) return;
    carousel_active.set(true);
    const slide_item = get_slide_item<T>(view);
    const slide_container = get_slide_container<T>(view);
    if (slide_container && slide_item) {
        const slide_w = slide_item?.clientWidth || 0;
        slide_container.scrollLeft += slide_w;
        const $carousel_index = get_store(carousel_index);
        const $carousel_index_max = get_store(carousel_index_max);
        carousel_index.set(
            Math.min($carousel_index + 1, $carousel_index_max),
        );
    }
    carousel_active.set(false);
};

export const carousel_inc = async <T extends string>(
    view: T,
    duration: number = CAROUSEL_DELAY_MS
): Promise<void> => {
    const $carousel_num = get_store(carousel_num);
    carousel_num.set(1);
    await exe_iter(async () => carousel_inc_handler(view), $carousel_num, duration);
};


export const carousel_dec = async <T extends string>(
    view: T,
    duration: number = CAROUSEL_DELAY_MS
): Promise<void> => {
    const $carousel_num = get_store(carousel_num);
    carousel_num.set(1);
    await exe_iter(async () => carousel_dec_handler(view), $carousel_num, duration);
};

export const carousel_init = async <T extends string>(view: T, num_max: number): Promise<void> => {
    await carousel_dec(view);
    carousel_index.set(0);
    carousel_index_max.set(num_max);
    carousel_num.set(1);
};
