<script lang="ts">
    import type { IIdOpt } from "$lib";
    import { onDestroy, onMount } from "svelte";

    export let basis: IIdOpt & {
        data: Uint8Array | undefined;
        alt?: string;
    };

    let img_url = ``;

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
    <img id={basis.id || null} src={img_url} alt={basis.alt || null} />
{/if}

<style>
    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        display: block;
    }
</style>
