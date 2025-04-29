<script lang="ts">
    import {
        EntryLine,
        EntrySelect,
        fmt_id,
        get_context,
        LayoutTrellisLine,
        type ISelectCallback,
        type ISelectOption,
    } from "$root";
    import {
        type CallbackPromiseGeneric,
        type FormField,
    } from "@radroots/util";

    const { ls } = get_context(`lib`);

    let {
        basis,
        val_sel = $bindable(``),
        val_sel_input = $bindable(``),
    }: {
        basis: {
            id: string;
            visible_input: boolean;
            callback_select: ISelectCallback;
            callback_visible: CallbackPromiseGeneric<boolean>;
            select_entries: ISelectOption<string>[];
            input_placeholder?: string;
            input_field?: FormField;
            entry_label?: string;
        };
        val_sel: string;
        val_sel_input: string;
    } = $props();
</script>

<LayoutTrellisLine
    basis={{
        label: {
            value: basis.entry_label || ``,
        },
        notify: basis.visible_input
            ? {
                  label: {
                      value: `${$ls(`common.close`)}`,
                  },
                  callback: async () => {
                      await basis.callback_visible(false);
                  },
              }
            : undefined,
    }}
>
    {#if !basis.visible_input}
        <EntrySelect
            bind:value={val_sel}
            basis={{
                wrap: {
                    id: fmt_id(`${basis.id}_wrap`),
                    layer: 1,
                },
                el: {
                    id: fmt_id(basis.id),
                    sync: true,
                    layer: 1,
                    options: [
                        {
                            entries: basis.select_entries,
                        },
                    ],
                    callback: basis.callback_select,
                },
            }}
        />
    {:else}
        <EntryLine
            bind:value={val_sel_input}
            basis={{
                wrap: {
                    id: fmt_id(`${basis.id}_wrap`),
                    layer: 1,
                },
                el: {
                    layer: 1,
                    classes: `fade-in`,
                    placeholder: basis.input_placeholder || ``,
                    field: basis.input_field || undefined,
                    field_constrain: !!basis.input_field,
                },
            }}
        />
    {/if}
</LayoutTrellisLine>
