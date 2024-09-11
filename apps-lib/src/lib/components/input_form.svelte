<script lang="ts">
    import { fmt_cl, Glyph, kv, parse_layer, type IInputFormBasis } from "$lib";
    import { onMount } from "svelte";

    let el: HTMLInputElement | null;

    export let basis: IInputFormBasis;
    $: basis = basis;

    $: layer =
        typeof basis.layer === `boolean` ? false : parse_layer(basis.layer, 1);
    $: classes_layer =
        typeof layer === `boolean`
            ? `bg-transparent`
            : `bg-layer-${layer}-surface`;
    $: classes_wrap = `px-4`;
    onMount(async () => {
        try {
            if (basis.sync) {
                const kv_val = await kv.get(basis.id);
                if (kv_val) el.value = kv_val;
                await kv.set(basis.id, kv_val || "");
            }
        } catch (e) {
            console.log(`e `, e);
        }
    });
</script>

<div
    class={`${fmt_cl(basis.classes_wrap)} relative form-line-wrap ${classes_wrap} ${classes_layer} transition-all`}
>
    <input
        bind:this={el}
        type="text"
        id={basis.id}
        class={`${fmt_cl(basis.classes)} form-input h-full text-layer-${layer}-glyph placeholder:text-layer-${layer}-glyph_pl caret-layer-${layer}-glyph`}
        placeholder={basis.placeholder || ""}
        on:input={async ({ currentTarget: el }) => {
            let pass = true;
            const val = el.value
                .split("")
                .filter((char) => basis.field.charset.test(char))
                .join("");
            if (
                !basis.field.validate.test(val) &&
                basis.field.validate_keypress
            ) {
                //el.classList.add(`form-invalid-layer-${layer}`);
                pass = false;
            } else {
                //el.classList.remove(`form-invalid-layer-${layer}`);
            }
            el.value = val;
            if (basis.sync) await kv.set(basis.id, val);
            if (basis.callback) await basis.callback({ val, pass });
        }}
    />
    {#if basis.notify_inline}
        {#if `glyph` in basis.notify_inline}
            <div
                class={`z-5 absolute right-0 top-0 flex flex-row h-full pr-3 justify-end items-center translate-x-[34px] fade-in transition-all`}
            >
                <Glyph
                    basis={typeof basis.notify_inline.glyph === `string`
                        ? {
                              key: basis.notify_inline.glyph,
                              dim: `xs+`,
                              weight: `bold`,
                              classes: `text-layer-${layer}-glyph`,
                          }
                        : basis.notify_inline.glyph}
                />
            </div>
        {/if}
    {/if}
</div>
