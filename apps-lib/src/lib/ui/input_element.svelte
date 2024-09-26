<script lang="ts">
    import { type IInputElement, fmt_cl, kv, parse_layer } from "$lib";
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
                else if (basis.sync) {
                    const kv_val = await kv.get(basis.id);
                    if (kv_val) el.value = kv_val;
                    await kv.set(basis.id, kv_val || ``);
                }
            }
            if (basis.on_mount) await basis.on_mount(el);
        } catch (e) {}
    });
</script>

<input
    bind:this={el}
    {id}
    type="text"
    class={`${fmt_cl(basis.classes)} form-input h-full text-layer-${layer}-glyph placeholder:text-layer-${layer}-glyph_pl caret-layer-${layer}-glyph`}
    placeholder={basis.placeholder || ""}
    on:input={async ({ currentTarget: el }) => {
        let pass = true;
        let val = el.value;
        if (basis.field) {
            val = el.value
                .split("")
                .filter((char) => basis.field.charset.test(char))
                .join("");
            if (
                !basis.field.validate.test(val) &&
                basis.field.validate_keypress
            ) {
                pass = false;
            }
        }
        el.value = val;
        if (basis.sync) await kv.set(basis.id, val);
        if (basis.callback) await basis.callback({ val, pass });
    }}
    on:keydown={async (ev) => {
        if (basis.callback_keydown)
            await basis.callback_keydown({ key: ev.key });
    }}
/>

<!--
    <input
    class={`${fmt_cl(basis.classes)} input flex flex-row p-[0px] border-[0px] focus:border-0 outline-[0px] focus:outline-0 text-layer-${layer}-glyph placeholder:text-layer-${layer}-glyph_pl placeholder:font-[300] caret-layer-${layer}-glyph bg-transparent`}
    placeholder={basis.placeholder || ``}
    value={basis.value}
    bind:this={el}
    on:input={async (ev) => {
        if (basis.callback_value)
            await basis.callback_value([ev.currentTarget.value, el]);
    }}
    on:keydown={async (ev) => {
        if (basis.callback_keydown)
            await basis.callback_keydown([ev.key, ev.currentTarget.value]);
    }}
/>
-->
