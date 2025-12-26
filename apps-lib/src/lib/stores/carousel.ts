import { get_store } from "$lib/utils/app";
import { exe_iter } from "@radroots/utils";
import { writable, type Writable } from "svelte/store";

const CAROUSEL_DELAY_MS = 150;
export const CAROUSEL_CONTEXT_KEY = "radroots:carousel";

export type CarouselStore<T extends string> = {
    view: T;
    container: Writable<HTMLElement | null>;
    item: Writable<HTMLElement | null>;
    index: Writable<number>;
    max_index: Writable<number>;
    step_count: Writable<number>;
    wrap: Writable<boolean>;
    active: Writable<boolean>;
    duration_ms: Writable<number>;
};

export type CarouselInit<T extends string> = {
    view: T;
    index?: number;
    max_index?: number;
    step_count?: number;
    wrap?: boolean;
    duration_ms?: number;
};

const max_index_safe = (max_index: number): number => Math.max(max_index, 0);

const step_count_safe = (step_count: number): number =>
    Math.max(step_count, 1);

const duration_safe = (duration_ms: number): number =>
    Math.max(duration_ms, 0);

const carousel_index_normalize = (
    index: number,
    max_index: number,
    wrap: boolean,
): number => {
    const max_index_safe_val = max_index_safe(max_index);
    if (max_index_safe_val === 0) return 0;
    if (wrap) {
        const range = max_index_safe_val + 1;
        const mod = index % range;
        return mod < 0 ? mod + range : mod;
    }
    if (index < 0) return 0;
    if (index > max_index_safe_val) return max_index_safe_val;
    return index;
};

const carousel_measure_width = <T extends string>(
    carousel: CarouselStore<T>,
): number => {
    const item = get_store(carousel.item);
    if (item?.clientWidth) return item.clientWidth;
    const container = get_store(carousel.container);
    return container?.clientWidth ?? 0;
};

const carousel_scroll_to = <T extends string>(
    carousel: CarouselStore<T>,
    index: number,
): void => {
    if (typeof window === "undefined") return;
    const container = get_store(carousel.container);
    if (!container) return;
    const width = carousel_measure_width(carousel);
    if (!width) return;
    requestAnimationFrame(() => {
        container.scrollLeft = width * index;
    });
};

const carousel_step = <T extends string>(
    carousel: CarouselStore<T>,
    delta: number,
): void => {
    const is_active = get_store(carousel.active);
    if (is_active) return;
    carousel.active.set(true);
    const index = get_store(carousel.index);
    const max_index = get_store(carousel.max_index);
    const wrap = get_store(carousel.wrap);
    const next_index = carousel_index_normalize(
        index + delta,
        max_index,
        wrap,
    );
    carousel.index.set(next_index);
    carousel_scroll_to(carousel, next_index);
    carousel.active.set(false);
};

export const carousel_create = <T extends string>(
    opts: CarouselInit<T>,
): CarouselStore<T> => {
    return {
        view: opts.view,
        container: writable<HTMLElement | null>(null),
        item: writable<HTMLElement | null>(null),
        index: writable<number>(opts.index ?? 0),
        max_index: writable<number>(max_index_safe(opts.max_index ?? 0)),
        step_count: writable<number>(step_count_safe(opts.step_count ?? 1)),
        wrap: writable<boolean>(opts.wrap ?? false),
        active: writable<boolean>(false),
        duration_ms: writable<number>(
            duration_safe(opts.duration_ms ?? CAROUSEL_DELAY_MS),
        ),
    };
};

export const carousel_register_container = <T extends string>(
    carousel: CarouselStore<T>,
    container: HTMLElement | null,
): (() => void) => {
    const current = get_store(carousel.container);
    if (current !== container) carousel.container.set(container);
    if (container) carousel_sync(carousel);
    return () => {
        const stored = get_store(carousel.container);
        if (stored === container) carousel.container.set(null);
    };
};

export const carousel_register_item = <T extends string>(
    carousel: CarouselStore<T>,
    item: HTMLElement | null,
): (() => void) => {
    const current = get_store(carousel.item);
    if (!current && item) carousel.item.set(item);
    if (item) carousel_sync(carousel);
    return () => {
        const stored = get_store(carousel.item);
        if (stored === item) carousel.item.set(null);
    };
};

export const carousel_sync = <T extends string>(
    carousel: CarouselStore<T>,
): void => {
    const index = get_store(carousel.index);
    const max_index = get_store(carousel.max_index);
    const wrap = get_store(carousel.wrap);
    const next_index = carousel_index_normalize(
        index,
        max_index,
        wrap,
    );
    if (next_index !== index) carousel.index.set(next_index);
    carousel_scroll_to(carousel, next_index);
};

export const carousel_watch = <T extends string>(
    carousel: CarouselStore<T>,
): (() => void) => {
    const unsubs = [
        carousel.index.subscribe(() => carousel_sync(carousel)),
        carousel.max_index.subscribe(() => carousel_sync(carousel)),
        carousel.wrap.subscribe(() => carousel_sync(carousel)),
        carousel.container.subscribe(() => carousel_sync(carousel)),
        carousel.item.subscribe(() => carousel_sync(carousel)),
    ];
    return () => {
        for (const unsub of unsubs) unsub();
    };
};

export const carousel_set_index = <T extends string>(
    carousel: CarouselStore<T>,
    index: number,
): void => {
    const max_index = get_store(carousel.max_index);
    const wrap = get_store(carousel.wrap);
    const next_index = carousel_index_normalize(index, max_index, wrap);
    carousel.index.set(next_index);
    carousel_scroll_to(carousel, next_index);
};

export const carousel_set_max = <T extends string>(
    carousel: CarouselStore<T>,
    max_index: number,
): void => {
    const next_max = max_index_safe(max_index);
    carousel.max_index.set(next_max);
    const index = get_store(carousel.index);
    const wrap = get_store(carousel.wrap);
    const next_index = carousel_index_normalize(index, next_max, wrap);
    carousel.index.set(next_index);
    carousel_scroll_to(carousel, next_index);
};

export const carousel_set_count = <T extends string>(
    carousel: CarouselStore<T>,
    count: number,
): void => {
    const max_index = count > 0 ? count - 1 : 0;
    carousel_set_max(carousel, max_index);
};

export const carousel_set_wrap = <T extends string>(
    carousel: CarouselStore<T>,
    wrap: boolean,
): void => {
    carousel.wrap.set(wrap);
    const index = get_store(carousel.index);
    const max_index = get_store(carousel.max_index);
    const next_index = carousel_index_normalize(index, max_index, wrap);
    carousel.index.set(next_index);
    carousel_scroll_to(carousel, next_index);
};

export const carousel_set_step_count = <T extends string>(
    carousel: CarouselStore<T>,
    step_count: number,
): void => {
    carousel.step_count.set(step_count_safe(step_count));
};

export const carousel_set_duration = <T extends string>(
    carousel: CarouselStore<T>,
    duration_ms: number,
): void => {
    carousel.duration_ms.set(duration_safe(duration_ms));
};

export const carousel_init = <T extends string>(
    carousel: CarouselStore<T>,
    opts?: Omit<CarouselInit<T>, "view">,
): void => {
    if (!opts) return;
    if (opts.wrap !== undefined) carousel.wrap.set(opts.wrap);
    if (opts.step_count !== undefined)
        carousel_set_step_count(carousel, opts.step_count);
    if (opts.duration_ms !== undefined)
        carousel_set_duration(carousel, opts.duration_ms);
    if (opts.max_index !== undefined)
        carousel.max_index.set(max_index_safe(opts.max_index));
    const wrap = get_store(carousel.wrap);
    const max_index = get_store(carousel.max_index);
    const index = opts.index ?? get_store(carousel.index);
    const next_index = carousel_index_normalize(index, max_index, wrap);
    carousel.index.set(next_index);
    carousel_scroll_to(carousel, next_index);
};

export const carousel_inc = async <T extends string>(
    carousel: CarouselStore<T>,
): Promise<void> => {
    const step_count = get_store(carousel.step_count);
    const duration_ms = get_store(carousel.duration_ms);
    await exe_iter(
        async () => {
            carousel_step(carousel, 1);
        },
        step_count,
        duration_ms,
    );
};

export const carousel_dec = async <T extends string>(
    carousel: CarouselStore<T>,
): Promise<void> => {
    const step_count = get_store(carousel.step_count);
    const duration_ms = get_store(carousel.duration_ms);
    await exe_iter(
        async () => {
            carousel_step(carousel, -1);
        },
        step_count,
        duration_ms,
    );
};
