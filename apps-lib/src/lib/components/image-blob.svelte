<script lang="ts">
    import type { IImageBlob } from "$lib/types/ui";
    import { fmt_cl, to_arr_buf } from "$lib/utils/app";

    let { basis }: { basis: IImageBlob } = $props();

    let img_src = $state<string | undefined>(undefined);

    $effect(() => {
        if (!basis.data) {
            img_src = undefined;
            return;
        }
        const url = URL.createObjectURL(
            new Blob([to_arr_buf(basis.data)], { type: "image/jpeg" })
        );
        img_src = url;
        return () => {
            URL.revokeObjectURL(url);
        };
    });
</script>

{#if img_src}
    <img
        id={basis?.id || null}
        class={`${fmt_cl(basis?.classes)}`}
        src={img_src}
        alt={basis?.alt || null}
        style="height: 100%; width: 100%; object-fit: cover; display: block;"
    />
{/if}
