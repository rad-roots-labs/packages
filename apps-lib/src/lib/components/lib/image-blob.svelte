<script lang="ts">
    import { type IImageBlob } from "$root";
    import { fmt_cl } from "@radroots/util";

    let { basis }: { basis: IImageBlob } = $props();

    const img_src = $derived(
        basis.data
            ? URL.createObjectURL(
                  new Blob([basis.data], {
                      type: "image/jpeg",
                  }),
              )
            : undefined,
    );
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
