<script lang="ts">
    import { EntryLine, fmt_id, LayoutTrellisLine, type IIdOpt } from "$root";
    import { type FormField } from "@radroots/util";

    let {
        basis,
        val = $bindable(``),
    }: {
        basis: IIdOpt & {
            entry_label: string;
            input_placeholder?: string;
            input_field?: FormField;
        };
        val: string;
    } = $props();

    const id = $derived(basis.id || ``);
</script>

<LayoutTrellisLine
    basis={{
        label: {
            value: basis.entry_label || ``,
        },
    }}
>
    <EntryLine
        bind:value={val}
        basis={{
            wrap: {
                id: id ? fmt_id(`${id}_wrap`) : undefined,
                layer: 1,
            },
            el: {
                id: id ? fmt_id(id) : undefined,
                layer: 1,
                classes: `fade-in`,
                placeholder: basis.input_placeholder || ``,
                field: basis.input_field || undefined,
                field_constrain: !!basis.input_field,
            },
        }}
    />
</LayoutTrellisLine>
