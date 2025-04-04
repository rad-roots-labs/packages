<script lang="ts">
    import { browser } from "$app/environment";
    import { handle_err, idb, type ITextArea } from "$root";
    import {
        fmt_cl,
        fmt_textarea_value,
        parse_layer,
        sleep,
        value_constrain_textarea,
    } from "@radroots/util";
    import { onMount } from "svelte";

    let {
        basis,
        value = $bindable(``),
        el = $bindable(null),
    }: {
        basis: ITextArea;
        value?: string;
        el?: HTMLTextAreaElement | null;
    } = $props();

    const id = $derived(basis?.id ? basis.id : null);
    const layer = $derived(
        typeof basis.layer === `boolean` ? 0 : parse_layer(basis.layer, 1),
    );

    onMount(async () => {
        try {
            if (id && basis?.sync && browser) {
                const sync_val = await idb.get(id);
                await idb.set(id, sync_val || ``);
            }
        } catch (e) {
            handle_err(e, `on_mount`);
        }
    });

    $effect(() => {
        if (browser && id && basis?.sync && value) {
            (async () => {
                await sleep(100);
                await idb.set(id, value);
            })();
        }
    });

    const handle_on_input = async (el: HTMLTextAreaElement): Promise<void> => {
        try {
            let pass = true;
            let val = el?.value;
            if (basis?.field && el) {
                val = value_constrain_textarea(basis?.field.charset, val);
                el.value = fmt_textarea_value(val);
                if (
                    !basis?.field.validate.test(val) &&
                    basis?.field_constrain
                ) {
                    //@todo set styles
                }
                pass = basis?.field.validate.test(val);
            }
            if (id && basis?.sync && browser) await idb.set(id, val);
            if (basis?.callback) await basis?.callback({ value: val, pass });
        } catch (e) {
            console.log(`(error) handle_on_input `, e);
        }
    };
</script>

<textarea
    bind:this={el}
    bind:value
    oninput={async ({ currentTarget: el }) => {
        await handle_on_input(el);
    }}
    onblur={async ({ currentTarget: el }) => {
        if (basis.callback_blur) await basis.callback_blur({ el });
    }}
    onfocus={async ({ currentTarget: el }) => {
        if (basis.callback_focus) await basis.callback_focus({ el });
    }}
    onkeydown={async (ev) => {
        if (basis.callback_keydown)
            await basis.callback_keydown({
                key: ev.key,
                key_s: ev.key === `Enter`,
                el: ev.currentTarget,
            });
    }}
    {id}
    contenteditable="true"
    class={`${fmt_cl(basis.classes)} el-textarea p-2 w-full bg-layer-${layer}-surface text-layer-${layer}-glyph_d placeholder:text-layer-${layer}-glyph_pl caret-layer-${layer}-glyph`}
    placeholder={basis.placeholder || ``}
></textarea>
