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

export const obj_en = <KeyType extends string, ValType>(object: Record<string, ValType>, parse_function: (key: string) => KeyType = (i) => i as KeyType): [KeyType, ValType][] => {
    return Object.entries(object).map<[KeyType, ValType]>(([k, v]) => [parse_function(k), v])
};

export const obj_truthy_fields = (obj: Record<string, string>): boolean => {
    return Object.values(obj).every(Boolean);
};

export const obj_result = (obj: any): string | undefined => {
    if (`result` in obj && typeof obj.result === `string`) return obj.result;
    return undefined;
};

export const obj_results_str = (obj: any): string[] | undefined => {
    if (Array.isArray(obj.results)) return obj.results.map(String);
    return undefined;
};

export const str_cap = (val?: string): string => {
    if (!val) return ``;
    return `${val[0].toUpperCase()}${val.slice(1)}`;
};

export const str_cap_words = (val?: string): string => {
    if (!val) return ``;
    return val.split(` `).map(i => i ? str_cap(i) : ``).filter(i => !!i).join(` `);
};

export function as_array_buffer(u8: Uint8Array): ArrayBuffer {
    if (u8.byteOffset === 0 && u8.buffer instanceof ArrayBuffer && u8.byteLength === u8.buffer.byteLength) {
        return u8.buffer;
    }
    return u8.slice().buffer;
}