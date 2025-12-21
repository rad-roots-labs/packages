import z from "zod";

export const schema_media_resource = z.object({
    base_url: z.string(),
    hash: z.string(),
    ext: z.string(),

});
export type MediaResource = z.infer<typeof schema_media_resource>;
