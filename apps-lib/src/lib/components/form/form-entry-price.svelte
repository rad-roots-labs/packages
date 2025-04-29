<script lang="ts">
    import {
        EntryWrap,
        fmt_id,
        get_context,
        Input,
        LayoutTrellisLine,
        lib_fmt_price,
        lib_parse_currency_marker,
        Select,
        type IIdOpt,
    } from "$root";
    import {
        fiat_currencies,
        form_fields,
        mass_units,
        type ElementCallbackValue,
    } from "@radroots/util";

    const { ls, locale } = get_context(`lib`);

    let {
        basis,
        val_input_price = $bindable(``),
        val_sel_currency = $bindable(``),
        val_sel_quantity_unit = $bindable(``),
    }: {
        basis: IIdOpt & {
            display_symbol?: boolean;
            entry_label?: string;
            input_placeholder?: string;
            callback_input?: ElementCallbackValue;
        };
        val_input_price: string;
        val_sel_currency: string;
        val_sel_quantity_unit: string;
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
            bind:value={val_input_price}
            basis={{
                id: id ? fmt_id(`${id}_input_price`) : undefined,
                layer: 1,
                sync: true,
                placeholder: basis.input_placeholder,
                field: form_fields.price,
                callback: basis.callback_input,
                callback_blur: async ({ el }) => {
                    if (!el.value) return;
                    el.value = lib_fmt_price(
                        $locale,
                        el.value,
                        val_sel_currency,
                    ).slice(1);
                    //@todo fmt handles 'en' only
                },
            }}
        />
        <div
            class={`absolute right-4 flex flex-row justify-start items-center`}
        >
            <Select
                bind:value={val_sel_currency}
                basis={{
                    id: id ? fmt_id(`${id}_sel_currency`) : undefined,
                    layer: 1,
                    sync: true,
                    classes: `w-fitfont-sans font-[400] el-re`,
                    options: [
                        {
                            entries: fiat_currencies.map((i) => ({
                                value: i,
                                label: basis.display_symbol
                                    ? lib_parse_currency_marker($locale, i)
                                    : i.toUpperCase(),
                            })),
                        },
                    ],
                }}
            />
            <div class={`flex flex-row px-2 justify-start items-center`}>
                <p class={`font-sans font-[400] text-layer-0-glyph`}>
                    {`/`}
                </p>
            </div>
            <Select
                bind:value={val_sel_quantity_unit}
                basis={{
                    id: id ? fmt_id(`${id}_sel_qty_unit`) : undefined,
                    sync: true,
                    layer: 1,
                    classes: `w-fit font-sans font-[400]`,
                    show_arrows: `r`,
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
        </div>
    </EntryWrap>
</LayoutTrellisLine>
