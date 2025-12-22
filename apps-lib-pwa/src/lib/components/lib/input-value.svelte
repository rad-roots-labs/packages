<script lang="ts">
    import {
        fmt_cl,
        type IInputValue,
        parse_layer,
        value_constrain,
    } from "@radroots/apps-lib";

    let {
        basis,
        el = $bindable(null),
        value = $bindable(``),
    }: {
        basis: IInputValue<string>;
        el?: HTMLInputElement | null;
        value: string;
    } = $props();

    const id = $derived(basis?.id ? basis.id : null);
    const layer = $derived(
        typeof basis?.layer === `boolean`
            ? parse_layer(0)
            : parse_layer(basis?.layer),
    );

    const classes_layer = $derived(
        typeof basis?.layer === `boolean` || typeof basis?.layer === `undefined`
            ? ``
            : `bg-ly${layer} text-ly${layer}-gl placeholder:text-ly${layer}-gl_pl caret-ly${layer}-gl`,
    );

    const handle_on_input = async (): Promise<void> => {
        try {
            let val_cur = value;
            let pass = true;
            if (basis?.field) {
                val_cur = value_constrain(basis.field.charset, val_cur);
                if (val_cur !== value) value = val_cur;
                pass = basis.field.validate.test(val_cur);
            }
            if (basis?.callback) await basis.callback({ value: val_cur, pass });
        } catch (e) {
            console.error(`(error) handle_on_input`, e);
        }
    };
</script>

<input
    bind:this={el}
    bind:value
    disabled={!!basis.disabled}
    oninput={handle_on_input}
    onblur={async ({ currentTarget: el }) => {
        if (basis.callback_blur) await basis.callback_blur({ el });
    }}
    onfocus={async ({ currentTarget: el }) => {
        if (basis.callback_focus) await basis.callback_focus({ el });
    }}
    onkeydown={async (ev) => {
        if (basis?.callback_keydown)
            await basis.callback_keydown({
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
