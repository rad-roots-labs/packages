<script lang="ts">
    import {
        type IInputElement,
        fmt_cl,
        kv,
        parse_layer,
        value_constrain,
    } from "$lib";
    import { onMount } from "svelte";

    let el: HTMLInputElement | null = null;

    export let basis: IInputElement;
    $: basis = basis;

    $: id = basis.id ? basis.id : null;
    $: layer =
        typeof basis.layer === `boolean` ? 0 : parse_layer(basis.layer, 1); //@todo

    onMount(async () => {
        try {
            if (basis.id) {
                if (basis.sync_init)
                    await kv.set(
                        basis.id,
                        typeof basis.sync_init === `string`
                            ? basis.sync_init
                            : ``,
                    );
                if (basis.sync) {
                    const kv_val = await kv.get(basis.id);
                    if (kv_val) el.value = kv_val;
                    else await kv.set(basis.id, ``);
                }
            }
            if (basis.on_mount) await basis.on_mount(el);
        } catch (e) {
            console.log(`e input mount`, e);
        }
    });
</script>

<input
    bind:this={el}
    {id}
    type="text"
    class={`${fmt_cl(basis.classes)} el-input text-layer-${layer}-glyph placeholder:text-layer-${layer}-glyph_pl caret-layer-${layer}-glyph`}
    placeholder={basis.placeholder || ""}
    on:input={async ({ currentTarget: el }) => {
        let pass = true;
        let val = el.value;
        if (basis.field) {
            val = value_constrain(basis.field.charset, val);
            el.value = val;
            if (
                !basis.field.validate.test(val) &&
                basis.field.validate_keypress
            ) {
                //@todo set styles
            }
            pass = basis.field.validate.test(val);
        }
        if (basis.sync) await kv.set(basis.id, val);
        if (basis.callback) await basis.callback({ value: val, pass });
    }}
    on:keydown={async (ev) => {
        if (basis.callback_keydown)
            await basis.callback_keydown({ key: ev.key, el: ev.currentTarget });
    }}
/>
