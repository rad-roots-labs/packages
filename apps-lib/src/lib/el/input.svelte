<script lang="ts">
    import { browser } from "$app/environment";
    import {
        type IInput,
        fmt_cl,
        kv_basis,
        parse_layer,
        value_constrain,
    } from "$lib";
    import { onMount } from "svelte";

    let el: HTMLInputElement | null = null;

    export let value: string = ``;
    export let basis: IInput<string>;

    onMount(async () => {
        try {
            await kv_init();
        } catch (e) {
        } finally {
        }
    });

    $: basis = basis;
    $: id = basis?.id ? basis?.id : null;
    $: layer =
        typeof basis?.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis?.layer);
    $: classes_layer =
        typeof basis?.layer === `boolean` || typeof basis?.layer === `undefined`
            ? ``
            : `bg-layer-${layer}-surface text-layer-${layer}-glyph placeholder:text-layer-${layer}-glyph_pl caret-layer-${layer}-glyph`;
    $: if (basis?.id && basis?.sync && value) {
        (async () => {
            try {
                browser && (await kv_basis.set(basis?.id, value));
            } catch (e) {}
        })();
    }

    const kv_init = async (): Promise<void> => {
        try {
            if (!basis?.id) return;
            if (basis?.sync) {
                const kv_val = browser && (await kv_basis.get(basis?.id));
                if (kv_val && el) el.value = kv_val;
                else browser && (await kv_basis.set(basis?.id, ``));
            }
            if (basis?.callback_mount) await basis?.callback_mount({ el });
        } catch (e) {
            console.log(`(error) kv_init `, e);
        }
    };

    const handle_on_input = async (el: HTMLInputElement): Promise<void> => {
        try {
            let pass = true;
            let val = el?.value;
            if (basis?.field && el) {
                val = value_constrain(basis?.field.charset, val);
                el.value = val;
                if (
                    !basis?.field.validate.test(val) &&
                    basis?.field.validate_keypress
                ) {
                    //@todo set styles
                }
                pass = basis?.field.validate.test(val);
            }
            if (basis?.sync) browser && (await kv_basis.set(basis?.id, val));
            if (basis?.callback) await basis?.callback({ value: val, pass });
        } catch (e) {
            console.log(`(error) handle_on_input `, e);
        }
    };
</script>

<input
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
        if (basis?.callback_keydown)
            await basis?.callback_keydown({
                key: ev.key,
                key_s: ev.key === `Enter`,
                el: ev.currentTarget,
            });
    }}
    {id}
    type="text"
    class={`${fmt_cl(basis?.classes)} el-input ${classes_layer} el-re`}
    placeholder={basis?.placeholder || ``}
/>
