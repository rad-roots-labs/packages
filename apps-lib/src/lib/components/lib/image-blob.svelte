<script lang="ts">
    import { type IImageBlob } from "$root";
    import { onDestroy, onMount } from "svelte";

    let { basis }: { basis: IImageBlob } = $props();

    let img_url = $state(``);

    onMount(async () => {
        try {
            if (!basis.data) return;
            img_url = URL.createObjectURL(
                new Blob([basis.data], {
                    type: "image/jpeg",
                }),
            );
        } catch (e) {
            console.log(`(error) image blob `, e);
        }
    });

    onDestroy(async () => {
        try {
            URL.revokeObjectURL(img_url);
        } catch (e) {}
    });
</script>

{#if img_url}
    <img
        id={basis.id || null}
        src={img_url}
        alt={basis.alt || null}
        style={`height: 100%; width: 100%; object-fit: cover; display: block;`}
    />
{/if}
