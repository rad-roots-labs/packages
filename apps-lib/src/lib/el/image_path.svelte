<script lang="ts">
    import type { IClOpt } from "$lib/types/client";
    import { fmt_cl } from "$lib/utils/client";
    import { onMount } from "svelte";

    export let basis: IClOpt & {
        path?: string;
        alt?: string;
    };

    let img_src = ``;

    onMount(async () => {
        try {
            if (basis.path) img_src = basis.path;
        } catch (e) {
        } finally {
        }
    });
</script>

{#if img_src}
    <img
        class={`${fmt_cl(basis.path)}`}
        src={img_src}
        alt={basis.alt || null}
    />
{/if}

<style>
    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        display: block;
    }
</style>
