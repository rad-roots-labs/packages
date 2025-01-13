import { casl_init, view_effect } from "$lib";

export const handle_view = <T extends string>(view: T, casl_rec: Record<T, { max_index: number }>): T => {
    casl_init(0, casl_rec[view].max_index);
    view_effect<T>(view);
    return view;
};