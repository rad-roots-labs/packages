<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<script lang="ts">
    import { type ICbGOpt, type IClOpt, type IIdOpt, fmt_cl } from "$lib";
    import { onMount } from "svelte";

    export let basis: IClOpt &
        ICbGOpt<
            MouseEvent & {
                currentTarget: EventTarget & HTMLImageElement;
            }
        > &
        IIdOpt & {
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
        id={basis?.id || null}
        class={`${fmt_cl(basis?.classes)}`}
        src={img_src}
        alt={basis?.alt || null}
        on:click|stopPropagation={async (ev) => {
            if (basis?.callback) await basis.callback(ev);
        }}
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
