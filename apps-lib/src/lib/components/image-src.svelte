<script lang="ts">
    import type { IImageSource } from "$lib/types/ui";
    import { fmt_cl } from "$lib/utils/lib";

    let { basis }: { basis: IImageSource } = $props();

    const img_src = $derived(basis.src);
</script>

{#if img_src}
    <img
        id={basis?.id || null}
        class={`${fmt_cl(basis?.classes)}`}
        src={img_src || null}
        alt={basis?.alt || null}
        style={`height: 100%; width: 100%; object-fit: cover; display: block;`}
    />
{/if}
