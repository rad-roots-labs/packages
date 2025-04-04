import { type FilePath } from "$root";

export type MediaImageUploadResult = {
    base_url: string;
    file_hash: string;
    file_ext: string;
};

export const fmt_media_image_upload_result_url = (res: MediaImageUploadResult): string => `${res.base_url}/${res.file_hash}.${res.file_ext}`;

export const parse_file_path = (file_path: string): FilePath | undefined => {
    const file_path_spl = file_path.split(`/`);
    const file_path_file = file_path_spl[file_path_spl.length - 1] || ``;
    const [file_name, mime_type] = file_path_file.split(`.`);
    if (!file_name || !mime_type) return undefined;
    return {
        file_path,
        file_name,
        mime_type
    };
};