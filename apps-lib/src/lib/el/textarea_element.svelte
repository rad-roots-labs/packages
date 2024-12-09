<script lang="ts">
    import {
        type ITextAreaElement,
        fmt_cl,
        fmt_textarea_value,
        kv,
        parse_layer,
        value_constrain_textarea,
    } from "$lib";
    import { onMount } from "svelte";

    let el: HTMLTextAreaElement | null = null;

    export let value: string = ``;
    export let basis: ITextAreaElement;
    $: basis = basis;

    $: id = basis.id ? basis.id : null;
    $: layer =
        typeof basis.layer === `boolean` ? 0 : parse_layer(basis.layer, 1); //@todo

    onMount(async () => {
        try {
            await kv_init();
        } catch (e) {}
    });

    $: if (basis?.id && basis?.sync && value) {
        (async () => {
            try {
                await kv.set(basis?.id, value);
            } catch (e) {}
        })();
    }

    const kv_init = async (): Promise<void> => {
        try {
            if (!basis?.id) return;
            if (basis?.sync) {
                const kv_val = await kv.get(basis?.id);
                if (kv_val && el) el.value = fmt_textarea_value(kv_val);
                else await kv.set(basis?.id, ``);
            }
            if (basis?.on_mount) await basis?.on_mount(el);
        } catch (e) {
            console.log(`(error) kv_init `, e);
        }
    };

    const handle_on_input = async (el: HTMLTextAreaElement): Promise<void> => {
        try {
            let pass = true;
            let val = el?.value;
            if (basis?.field && el) {
                val = value_constrain_textarea(basis?.field.charset, val);
                el.value = fmt_textarea_value(val);
                if (
                    !basis?.field.validate.test(val) &&
                    basis?.field.validate_keypress
                ) {
                    //@todo set styles
                }
                pass = basis?.field.validate.test(val);
            }
            if (basis?.sync) await kv.set(basis?.id, val);
            if (basis?.callback) await basis?.callback({ value: val, pass });
        } catch (e) {
            console.log(`(error) handle_on_input `, e);
        }
    };
</script>

<textarea
    bind:this={el}
    bind:value
    on:input={async ({ currentTarget: el }) => {
        await handle_on_input(el);
    }}
    on:blur={async ({ currentTarget: el }) => {
        if (basis.callback_blur) await basis.callback_blur({ el });
    }}
    on:focus={async ({ currentTarget: el }) => {
        if (basis.callback_focus) await basis.callback_focus({ el });
    }}
    on:keydown={async (ev) => {
        if (basis.callback_keydown)
            await basis.callback_keydown({
                key: ev.key,
                key_s: ev.key === `Enter`,
                el: ev.currentTarget,
            });
    }}
    {id}
    contenteditable="true"
    class={`${fmt_cl(basis.classes)} el-textarea w-full bg-layer-${layer}-surface text-layer-${layer}-glyph placeholder:text-layer-${layer}-glyph_pl caret-layer-${layer}-glyph`}
    placeholder={basis.placeholder || ``}
/>
