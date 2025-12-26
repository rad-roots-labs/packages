<script lang="ts">
    import { get_context, ImageBlob, ImageSrc } from "@radroots/apps-lib";
    import type { IImagePath } from "@radroots/apps-lib";
    import type { LibContext } from "$lib/types/context";

    const { lc_img_bin } = get_context<LibContext>(`lib`);
    let { basis }: { basis: IImagePath } = $props();

    const img_path = $derived(basis.path);
</script>

{#if img_path}
    {@const is_bin = img_path.startsWith(`file:`)}

    {#if is_bin}
        {#await lc_img_bin(img_path) then data}
            <ImageBlob basis={{ data, ...basis }} />
        {/await}
    {:else}
        <ImageSrc basis={{ src: img_path, ...basis }} />
    {/if}
{/if}
