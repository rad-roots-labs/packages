<script lang="ts">
    import { type IImage } from "$root";
    import { fmt_cl } from "@radroots/util";

    let { basis }: { basis: IImage } = $props();
</script>

{#if basis.src}
    <img
        id={basis?.id || null}
        class={`${fmt_cl(basis?.classes)}`}
        src={basis.src}
        alt={basis?.alt || null}
        style={`height: 100%; width: 100%; object-fit: cover; display: block;`}
    />
{/if}
