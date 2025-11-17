<script lang="ts">
    import type { IImageBlob } from "$lib/types/ui";
    import { fmt_cl, to_arr_buf } from "$lib/utils/lib";

    let { basis }: { basis: IImageBlob } = $props();

    const img_src = $derived(
        basis.data
            ? URL.createObjectURL(
                  new Blob(
                      [
                          basis.data instanceof Uint8Array
                              ? to_arr_buf(basis.data)
                              : basis.data,
                      ],
                      { type: "image/jpeg" },
                  ),
              )
            : undefined,
    );
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
