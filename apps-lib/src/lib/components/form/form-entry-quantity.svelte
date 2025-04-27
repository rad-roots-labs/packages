<script lang="ts">
    import {
        EntryWrap,
        fmt_id,
        Input,
        LayoutTrellisLine,
        Select,
        type IIdOpt,
    } from "$root";
    import {
        form_fields,
        mass_units,
        type ElementCallbackValue,
        type I18nTranslateFunction,
    } from "@radroots/util";

    let {
        basis,
        ls,
        val_input_quantity = $bindable(``),
        val_sel_quantity_unit = $bindable(``),
        val_sel_quantity_label = $bindable(``),
    }: {
        basis: IIdOpt & {
            display_symbol?: boolean;
            entry_label?: string;
            input_placeholder?: string;
            callback_input?: ElementCallbackValue;
        };
        ls: I18nTranslateFunction;
        val_input_quantity: string;
        val_sel_quantity_unit: string;
        val_sel_quantity_label: string;
    } = $props();

    const id = $derived(basis.id ? basis.id : ``);
</script>

<LayoutTrellisLine
    basis={{
        label: {
            value: basis.entry_label || ``,
        },
    }}
>
    <EntryWrap
        basis={{
            id: id ? fmt_id(`${id}_wrap`) : undefined,
            layer: 1,
        }}
    >
        <Input
            bind:value={val_input_quantity}
            basis={{
                id: id ? fmt_id(`${id}_input_quantity`) : undefined,
                layer: 1,
                sync: true,
                placeholder: basis.input_placeholder,
                field: form_fields.quantity,
                callback: basis.callback_input,
            }}
        />
        <div
            class={`absolute right-4 flex flex-row gap-1 justify-start items-center`}
        >
            <Select
                bind:value={val_sel_quantity_unit}
                basis={{
                    id: id ? fmt_id(`${id}_sel_quantity_unit`) : undefined,
                    layer: 1,
                    sync: true,
                    classes: `w-fit font-sans font-[400] el-re`,
                    options: [
                        {
                            entries: mass_units.map((i) => ({
                                value: i,
                                label: `${$ls(`units.mass.unit.${i}_ab`)}`.toLowerCase(),
                            })),
                        },
                    ],
                }}
            />
            <Select
                bind:value={val_sel_quantity_label}
                basis={{
                    id: id ? fmt_id(`${id}_sel_quantity_label`) : undefined,
                    sync: true,
                    layer: 1,
                    classes: `w-fit font-sans font-[400] pr-2`,
                    show_arrows: `r`,
                    options: [
                        {
                            entries: [
                                {
                                    value: `bag`,
                                    label: `${$ls(`common.bag`)}`.toLowerCase(),
                                },
                            ],
                        },
                    ],
                }}
            />
        </div>
    </EntryWrap>
</LayoutTrellisLine>
