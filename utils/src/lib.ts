import { CallbackPromise } from "./types/lib.js";

export const exe_iter = async (callback: CallbackPromise, num: number = 1, delay: number = 400): Promise<void> => {
    try {
        const iter_fn = (count: number) => {
            if (count > 0) {
                callback();
                if (count > 1) {
                    setTimeout(() => {
                        iter_fn(count - 1);
                    }, delay);
                }
            }
        };
        iter_fn(num);
    } catch (e) {
        console.log(`(error) exe_iter `, e);
    }
};

export type MediaImageUploadResult = {
    base_url: string;
    file_hash: string;
    file_ext: string;
};

export const fmt_media_image_upload_result_url = (res: MediaImageUploadResult): string => `${res.base_url}/${res.file_hash}.${res.file_ext}`;
