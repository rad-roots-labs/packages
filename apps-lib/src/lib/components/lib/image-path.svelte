<script lang="ts">
    import { fmt_cl, type IImagePath } from "@radroots/util";
    import { onMount } from "svelte";

    let { basis }: { basis: IImagePath } = $props();

    let img_src = $state(``);

    onMount(async () => {
        try {
            if (basis.path) img_src = basis.path;
        } catch (e) {
        } finally {
        }
    });
</script>

{#if img_src}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <img
        id={basis?.id || null}
        class={`${fmt_cl(basis?.classes)}`}
        src={img_src}
        alt={basis?.alt || null}
        style={`height: 100%; width: 100%; object-fit: cover; display: block;`}
        onclick={async (ev) => {
            ev.stopPropagation();
            if (basis?.callback) await basis.callback(ev);
        }}
    />
{/if}
