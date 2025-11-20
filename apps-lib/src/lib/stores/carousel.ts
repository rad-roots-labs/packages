import { get_store } from "$lib/utils/app/lib";
import { writable } from "svelte/store";

export const casl_active = writable<boolean>(false);
export const casl_i = writable<number>(0);
export const casl_imax = writable<number>(0);

const create_carousel_num = (num_i: number, num_min: number) => {
    const store = writable<number>(num_i);
    return {
        subscribe: store.subscribe,
        set: (num: number) => {
            store.set(Math.max(num, num_min));
        },
        update: (updater: (num: number) => number) => {
            store.update((num) => Math.max(updater(num), num_min));
        }
    };
}
export const casl_num = create_carousel_num(1, 1);

export const casl_inc = async (opts?: 'noflow'): Promise<void> => {
    const $casl_i = get_store(casl_i);
    const $casl_imax = get_store(casl_imax);
    if (opts === 'noflow' && $casl_i < $casl_imax) casl_i.set($casl_i + 1);
    else casl_i.set(($casl_i + 1) % ($casl_imax + 1));
};

export const casl_dec = async (opts?: 'noflow'): Promise<void> => {
    const $casl_i = get_store(casl_i);
    const $casl_imax = get_store(casl_imax);
    if (opts === 'noflow' && $casl_i > 0) casl_i.set($casl_i - 1);
    else casl_i.set(($casl_i - 1 + ($casl_imax + 1)) % ($casl_imax + 1));
};

export const casl_init = (index_curr: number, index_max: number): void => {
    casl_i.set(index_curr);
    casl_imax.set(index_max);
};
