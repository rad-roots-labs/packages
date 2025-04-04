<script lang="ts">
    import {
        EntrySelect,
        fmt_id,
        LayoutTrellisLine,
        type IClOpt,
        type IIdOpt,
        type ISelectCallback,
        type ISelectOption,
    } from "$root";

    let {
        basis,
        val = $bindable(``),
    }: {
        basis: IIdOpt &
            IClOpt & {
                callback?: ISelectCallback;
                entries: ISelectOption<string>[];
                entry_label?: string;
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
    <EntrySelect
        bind:value={val}
        basis={{
            wrap: {
                id: id ? fmt_id(`${id}_wrap`) : undefined,
                layer: 1,
            },
            el: {
                id: id ? fmt_id(id) : undefined,
                classes: basis.classes,
                sync: true,
                layer: 1,
                options: [
                    {
                        entries: basis.entries,
                    },
                ],
                callback: basis.callback,
            },
        }}
    />
</LayoutTrellisLine>
