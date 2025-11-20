<script lang="ts">
    import type { IImagePath } from "$lib/types/ui";
    import { get_context } from "$lib/utils/app/lib";
    import ImageBlob from "./image-blob.svelte";
    import ImageSrc from "./image-src.svelte";

    const { lc_img_bin } = get_context(`lib`);
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
