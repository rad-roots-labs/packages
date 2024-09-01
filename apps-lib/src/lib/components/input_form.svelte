<script lang="ts">
    import { kv, type IInputFormBasis } from "$lib";
    import type { ThemeLayer } from "@radroots/theme";
    import { onMount } from "svelte";

    export let basis: IInputFormBasis;
    $: basis = basis;

    let layer: ThemeLayer = 0;
    $: layer = basis.layer;

    let el: HTMLInputElement | null;

    onMount(async () => {
        try {
            if (basis.sync) await $kv.set(basis.id, "");
        } catch (e) {
            console.log(`e `, e);
        }
    });
</script>

<input
    bind:this={el}
    type="text"
    class={`form-input text-layer-${layer}-glyph placeholder:text-layer-${layer}-glyph_pl placeholder:font-[300] caret-layer-${layer}-glyph`}
    id={basis.id}
    placeholder={basis.placeholder || ""}
    on:input={async ({ currentTarget: el }) => {
        const val = el.value
            .split("")
            .filter((char) => basis.field.charset.test(char))
            .join("");
        if (!basis.field.validate.test(val) && basis.field.validateKeypress)
            el.classList.add(`form-input-invalid`);
        else el.classList.remove("form-entry-invalid");
        el.value = val;
        if (basis.sync) {
            await $kv.set(basis.id, val);
        }
    }}
/>
