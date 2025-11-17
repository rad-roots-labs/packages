<script lang="ts">
    import { browser } from "$app/environment";
    import {
        fmt_cl,
        idb,
        type IInput,
        parse_layer,
        value_constrain,
    } from "@radroots/apps-lib";
    import { handle_err } from "@radroots/utils";
    import { onMount } from "svelte";

    let {
        basis,
        el = $bindable(null),
        value = $bindable(``),
    }: {
        basis: IInput<string>;
        el?: HTMLInputElement | null;
        value?: string;
    } = $props();

    const id = $derived(basis?.id ? basis.id : null);
    const layer = $derived(
        typeof basis?.layer === `boolean` ? 0 : parse_layer(basis?.layer),
    );
    const classes_layer = $derived(
        typeof basis?.layer === `boolean` || typeof basis?.layer === `undefined`
            ? ``
            : `bg-ly${layer} text-ly${layer}-gl_d placeholder:text-ly${layer}-gl_pl caret-ly${layer}-gl`,
    );

    const sync_from_idb = async (): Promise<void> => {
        if (!browser || !idb || !id) return;
        try {
            const kv_val = await idb.get(id);
            if (kv_val !== null && kv_val !== undefined && kv_val !== value) {
                value = kv_val;
            } else if (kv_val === null || kv_val === undefined) {
                value = ``;
                await idb.set(id, ``);
            }
        } catch (e) {
            handle_err(e, `sync_from_idb`);
        }
    };

    const sync_to_idb = async (): Promise<void> => {
        if (!browser || !idb || !id) return;
        try {
            await idb.set(id, value || ``);
        } catch (e) {
            handle_err(e, `input_idb_sync`);
        }
    };

    onMount(async () => {
        await sync_from_idb();
        if (basis?.callback_mount && el) {
            try {
                await basis.callback_mount({ el });
            } catch (e) {
                handle_err(e, `callback_mount`);
            }
        }
    });

    $effect(() => {
        if (id && basis?.sync && browser && idb) {
            (async () => {
                await sync_to_idb();
            })();
        }
    });

    const handle_on_input = async (): Promise<void> => {
        try {
            let val_cur = value;
            let pass = true;
            if (basis?.field) {
                val_cur = value_constrain(basis.field?.charset, val_cur);
                if (val_cur !== value) {
                    value = val_cur;
                }
                pass = basis.field?.validate.test(val_cur);
            }
            if (basis?.callback) {
                await basis.callback({ value: val_cur, pass });
            }
        } catch (e) {
            handle_err(e, `handle_on_input`);
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
        if (id && basis.sync && browser && idb) await sync_from_idb();
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
