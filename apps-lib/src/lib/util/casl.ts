import { casl_i, casl_imax, get_store } from "$root";

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
