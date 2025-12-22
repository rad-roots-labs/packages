import z from "zod";

export const schema_media_resource = z.object({
    base_url: z.string(),
    hash: z.string(),
    ext: z.string(),

});
export type MediaResource = z.infer<typeof schema_media_resource>;

export type MediaImageUploadResult = {
    base_url: string;
    file_hash: string;
    file_ext: string;
};

export const fmt_media_image_upload_result_url = (res: MediaImageUploadResult): string => `${res.base_url}/${res.file_hash}.${res.file_ext}`;
