<script lang="ts">
    import {
        EntryMultiline,
        LayoutTrellisLine,
        fmt_id,
        type IIdOpt,
    } from "$root";
    import {
        type ElementCallbackValueKeydown,
        type FormField,
    } from "@radroots/util";

    let {
        basis,
        val = $bindable(``),
    }: {
        basis: IIdOpt & {
            entry_label?: string;
            placeholder?: string;
            field?: FormField;
            callback_keydown?: ElementCallbackValueKeydown<HTMLTextAreaElement>;
        };
        val: string;
    } = $props();

    const id = $derived(basis.id || ``);
</script>

<LayoutTrellisLine
    basis={{
        classes: `h-full`,
        label: {
            value: basis.entry_label || ``,
        },
    }}
>
    <EntryMultiline
        bind:value={val}
        basis={{
            wrap: {
                id: id ? fmt_id(`${id}_wrap`) : undefined,
                classes: `h-full`,
            },
            el: {
                classes: `h-full overflow-hidden`,
                id: id ? fmt_id(id) : undefined,
                sync: true,
                placeholder: basis.placeholder || ``,
                field: basis.field || undefined,
                field_constrain: !!basis.field,
                callback_keydown: basis.callback_keydown,
            },
        }}
    />
</LayoutTrellisLine>
