import { casl_index, casl_index_max } from "$lib/store/component";
import { get_store } from "./app";

export const casl_inc = async (opts?: 'reflow'): Promise<void> => {
    const $casl_index = get_store(casl_index);
    const $casl_index_max = get_store(casl_index_max);
    casl_index.set(($casl_index + 1) % $casl_index_max);
};

export const casl_dec = async (opts?: 'reflow'): Promise<void> => {
    const $casl_index = get_store(casl_index);
    const $casl_index_max = get_store(casl_index_max);
    casl_index.set(($casl_index - 1 + $casl_index_max) % $casl_index_max);
};

export const casl_init = (index_curr: number, index_max: number): void => {
    casl_index.set(index_curr);
    casl_index_max.set(index_max);
};