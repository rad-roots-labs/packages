<script lang="ts">
    import { type IInputValue } from "$root";
    import { fmt_cl, parse_layer, value_constrain } from "@radroots/util";

    let {
        basis,
        el = $bindable(null),
        value = $bindable(``),
    }: {
        basis: IInputValue<string>;
        el?: HTMLInputElement | null;
        value?: string;
    } = $props();

    const layer = $derived(
        typeof basis?.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis?.layer),
    );

    const classes_layer = $derived(
        typeof basis?.layer === `boolean` || typeof basis?.layer === `undefined`
            ? ``
            : `bg-layer-${layer}-surface text-layer-${layer}-glyph placeholder:text-layer-${layer}-glyph_pl caret-layer-${layer}-glyph`,
    );

    const handle_on_input = async (el: HTMLInputElement): Promise<void> => {
        try {
            let pass = true;
            let val = el?.value;
            if (basis?.field && el) {
                val = value_constrain(basis?.field.charset, val);
                el.value = val;
                if (
                    !basis?.field.validate.test(val) &&
                    basis?.field_constrain
                ) {
                    //@todo set styles
                }
                pass = basis?.field.validate.test(val);
            }
            if (basis?.callback) await basis?.callback({ value: val, pass });
        } catch (e) {
            console.log(`(error) handle_on_input `, e);
        }
    };

    $effect(() => {
        console.log(`value `, value);
    });
</script>

<input
    bind:this={el}
    bind:value
    disabled={!!basis.disabled}
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
        if (basis?.callback_keydown)
            await basis?.callback_keydown({
                key: ev.key,
                key_s: ev.key === `Enter`,
                el: ev.currentTarget,
            });
    }}
    type="text"
    class={`${fmt_cl(basis?.classes)} el-input ${classes_layer} el-re`}
    placeholder={basis?.placeholder || ``}
/>
