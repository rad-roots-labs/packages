
import { casl_active, casl_i, casl_imax, casl_num } from "$lib/stores/carousel";
import { exe_iter } from "@radroots/utils";
import { get_store } from "./lib";

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
    const casl_active_val = get_store(casl_active);
    if (casl_active_val) return;
    casl_active.set(true);
    const slide_item = get_slide_item<T>(view);
    const slide_container = get_slide_container<T>(view);
    if (slide_container && slide_item) {
        const slide_w = slide_item?.clientWidth || 0;
        slide_container.scrollLeft -= slide_w;
        const casl_i_val = get_store(casl_i);
        casl_i.set(Math.max(casl_i_val - 1, 0));
    }
    casl_active.set(false);
};

const carousel_inc_handler = async <T extends string>(
    view: T,
): Promise<void> => {
    const casl_active_val = get_store(casl_active);
    if (casl_active_val) return;
    casl_active.set(true);
    const slide_item = get_slide_item<T>(view);
    const slide_container = get_slide_container<T>(view);
    if (slide_container && slide_item) {
        const slide_w = slide_item?.clientWidth || 0;
        slide_container.scrollLeft += slide_w;
        const casl_i_val = get_store(casl_i);
        const casl_i_valmax = get_store(casl_imax);
        casl_i.set(
            Math.min(casl_i_val + 1, casl_i_valmax),
        );
    }
    casl_active.set(false);
};

export const carousel_inc = async <T extends string>(
    view: T,
    duration: number = CAROUSEL_DELAY_MS
): Promise<void> => {
    const casl_num_val = get_store(casl_num);
    casl_num.set(1);
    await exe_iter(async () => carousel_inc_handler(view), casl_num_val, duration);
};


export const carousel_dec = async <T extends string>(
    view: T,
    duration: number = CAROUSEL_DELAY_MS
): Promise<void> => {
    const casl_num_val = get_store(casl_num);
    casl_num.set(1);
    await exe_iter(async () => carousel_dec_handler(view), casl_num_val, duration);
};

export const carousel_init = async <T extends string>(view: T, num_max: number): Promise<void> => {
    await carousel_dec(view);
    casl_i.set(0);
    casl_imax.set(num_max);
    casl_num.set(1);
};
